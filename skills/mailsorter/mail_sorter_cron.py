#!/usr/bin/env python3
"""
Intelligent Email Processor v3
Improvements:
  #3 - Two-pass categorization for low-confidence results (snippet re-query)
  #4 - Label deduplication (fetch existing labels before applying)
  #5 - Sender stats decay (rolling window of last 30 observations)
  #6 - ToDo label with dedicated keyword detection
  #9 - SQLite storage for queryable email history
"""

import os
import json
import sqlite3
import subprocess
import sys
import urllib.request
import urllib.error
import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

# ─── Configuration ────────────────────────────────────────────────────────────

GOG_ACCOUNT           = "denniarems@gmail.com"
GOG_KEYRING_PASSWORD  = "google_key"
MAX_EMAILS            = 20
CHUNK_SIZE            = 10
CONFIDENCE_THRESHOLD  = 0.75   # Below this → second pass with snippet
STATS_WINDOW          = 30     # Rolling window size for sender stats decay

BASE_DIR              = Path("/home/denny/.openclaw/workspace")
MEMORY_DIR            = BASE_DIR / "memory"
DRAFTS_DIR            = BASE_DIR / "mail_drafts"
DB_PATH               = MEMORY_DIR / "emails.db"
SENDER_STATS_PATH     = MEMORY_DIR / "sender_stats.json"
URGENT_PATH           = MEMORY_DIR / "urgent_emails.json"

STEP_API_KEY          = os.getenv("STEP_API_KEY", "")
STEP_BASE_URL         = "https://api.stepfun.ai/v1/chat/completions"
STEP_MODEL            = "step-3.5-flash"

ALLOWED_LABELS = {
    "Finance Mails", "Keys", "Personal", "Priority",
    "Security", "ToDo", "Work", "Ads"
}

# ─── Logging ──────────────────────────────────────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
log = logging.getLogger(__name__)

# ─── AI Prompts ───────────────────────────────────────────────────────────────

SYSTEM_PROMPT = """You are an email triage expert. Categorize each email into EXACTLY ONE category.

CATEGORIES (in priority order):
- Priority      → Urgent/time-sensitive: job offers, failed payments, large transfers (>$500),
                  suspicious logins, account lockouts, legal notices, interview invitations.
- Work          → Projects, meetings, professional collaboration, status updates, job alerts.
- Finance Mails → Routine billing: invoices, monthly statements, subscription renewals,
                  small transaction receipts, bank notifications (non-suspicious).
- Security      → Verification codes, 2FA, password resets, API keys, identity confirmation
                  (non-suspicious — suspicious ones → Priority).
- Keys          → License keys, product activation codes, software serials.
- Ads           → Marketing, promotions, newsletters, sales emails, unsubscribe-heavy content.
- ToDo          → Clear action items: deadlines, tasks assigned to you, approvals needed,
                  "please complete", "please review", "by [date]", scheduled reminders.
- Personal      → Everything else: personal messages, general interest, social notifications.

RULES:
1. When in doubt between Priority and another category → choose Priority.
2. When in doubt between ToDo and Work → use ToDo only if an explicit action/deadline is stated.
3. Use sender domain AND subject together — not keywords alone.
4. confidence = your certainty (0.0–1.0). Be honest; low confidence triggers a deeper analysis pass.
5. Return ONLY valid JSON, no markdown, no explanation.

OUTPUT FORMAT:
{"results": [{"subject": "...", "sender_domain": "...", "category": "...", "confidence": 0.95}]}"""

SECOND_PASS_PROMPT = """You previously categorized an email but with low confidence.
Now you have the full snippet. Re-evaluate and give your best single category.

CATEGORIES: Priority, Work, Finance Mails, Security, Keys, Ads, ToDo, Personal
(Priority > Work/Finance/Security > Ads/ToDo > Personal)

Return ONLY valid JSON:
{"subject": "...", "category": "...", "confidence": 0.95}"""

USER_PROMPT_TEMPLATE = """Categorize these emails. Each entry has "subject" and "from" fields.

{email_json}"""

SECOND_PASS_TEMPLATE = """Email to re-evaluate:
Subject : {subject}
From    : {sender}
Snippet : {snippet}"""

# ─── Helpers ──────────────────────────────────────────────────────────────────

def ensure_dirs():
    for d in [MEMORY_DIR, DRAFTS_DIR]:
        d.mkdir(parents=True, exist_ok=True)

def save_json(path: Path, data):
    path.write_text(json.dumps(data, indent=2, default=str))

def exec_gog(*args) -> Optional[str]:
    env = {**os.environ, "GOG_KEYRING_PASSWORD": GOG_KEYRING_PASSWORD}
    result = subprocess.run(
        ["gog", *args, f"--account={GOG_ACCOUNT}"],
        env=env, capture_output=True, text=True
    )
    return result.stdout if result.returncode == 0 else None

def parse_ai_response(content: str) -> Optional[dict]:
    """Parse AI JSON response, stripping markdown fences if present."""
    content = content.strip()
    if content.startswith("```"):
        content = content.split("\n", 1)[-1].rsplit("```", 1)[0].strip()
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        return None

# ─── SQLite Storage (#9) ──────────────────────────────────────────────────────

def init_db() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS emails (
            id           TEXT PRIMARY KEY,
            sender       TEXT,
            subject      TEXT,
            snippet      TEXT,
            date         TEXT,
            category     TEXT,
            confidence   REAL,
            is_meeting   INTEGER,
            needs_reply  INTEGER,
            is_urgent    INTEGER,
            is_todo      INTEGER,
            processed_at TEXT
        );

        CREATE TABLE IF NOT EXISTS sender_stats (
            domain     TEXT PRIMARY KEY,
            history    TEXT,
            updated_at TEXT
        );

        CREATE INDEX IF NOT EXISTS idx_category  ON emails(category);
        CREATE INDEX IF NOT EXISTS idx_date      ON emails(date);
        CREATE INDEX IF NOT EXISTS idx_processed ON emails(processed_at);
    """)
    conn.commit()
    return conn

def upsert_email(conn: sqlite3.Connection, record: dict):
    conn.execute("""
        INSERT INTO emails
            (id, sender, subject, snippet, date, category, confidence,
             is_meeting, needs_reply, is_urgent, is_todo, processed_at)
        VALUES
            (:id, :sender, :subject, :snippet, :date, :category, :confidence,
             :is_meeting, :needs_reply, :is_urgent, :is_todo, :processed_at)
        ON CONFLICT(id) DO UPDATE SET
            category     = excluded.category,
            confidence   = excluded.confidence,
            is_meeting   = excluded.is_meeting,
            needs_reply  = excluded.needs_reply,
            is_urgent    = excluded.is_urgent,
            is_todo      = excluded.is_todo,
            processed_at = excluded.processed_at
    """, record)

def get_db_category(conn: sqlite3.Connection, email_id: str) -> Optional[str]:
    row = conn.execute("SELECT category FROM emails WHERE id = ?", (email_id,)).fetchone()
    return row["category"] if row else None

# ─── Sender Stats with Rolling-Window Decay (#5) ──────────────────────────────

def load_sender_stats(conn: sqlite3.Connection) -> dict:
    """Returns {domain: [category_str, ...]} — a rolling history list."""
    rows = conn.execute("SELECT domain, history FROM sender_stats").fetchall()
    return {row["domain"]: json.loads(row["history"]) for row in rows}

def update_sender_stats(conn: sqlite3.Connection, stats: dict, sender: str, category: str) -> str:
    """
    Append new category to the rolling window.
    Oldest entries are evicted once the window exceeds STATS_WINDOW.
    This is the decay mechanism — stale domain behavior naturally ages out.
    """
    domain  = sender.split("@")[-1].lower() if "@" in sender else sender.lower()
    history = stats.get(domain, [])
    history.append(category)
    if len(history) > STATS_WINDOW:
        history = history[-STATS_WINDOW:]
    stats[domain] = history
    conn.execute("""
        INSERT INTO sender_stats (domain, history, updated_at)
        VALUES (?, ?, ?)
        ON CONFLICT(domain) DO UPDATE SET
            history    = excluded.history,
            updated_at = excluded.updated_at
    """, (domain, json.dumps(history), datetime.now(timezone.utc).isoformat()))
    return domain

def dominant_category(domain: str, stats: dict) -> Optional[str]:
    """
    Return dominant category from rolling window if:
    - ≥ 3 observations exist
    - Top category ≥ 70% of the window
    Recency bias is implicit: old observations age out of the window first.
    """
    history = stats.get(domain, [])
    if len(history) < 3:
        return None
    counts = {}
    for cat in history:
        counts[cat] = counts.get(cat, 0) + 1
    top        = max(counts, key=counts.get)
    confidence = counts[top] / len(history)
    return top if confidence >= 0.70 else None

# ─── Gmail Operations ─────────────────────────────────────────────────────────

def get_unread_emails(limit: int = MAX_EMAILS) -> list:
    output = exec_gog("gmail", "search", "is:unread", f"--max={limit}", "--json")
    if not output:
        return []
    try:
        return json.loads(output).get("threads", [])
    except json.JSONDecodeError:
        log.warning("Failed to parse email JSON from gog.")
        return []

def get_email_labels(email_id: str) -> set:
    """Fetch current Gmail label names for an email. Used for deduplication (#4)."""
    output = exec_gog("gmail", "get", email_id, "--json")
    if not output:
        return set()
    try:
        data = json.loads(output)
        return set(data.get("labelIds", []))
    except json.JSONDecodeError:
        return set()

def apply_label(email_id: str, label: str, existing_labels: Optional[set] = None):
    """
    Apply label only if not already present. (#4)
    existing_labels can be pre-fetched to avoid redundant gog calls.
    """
    if label not in ALLOWED_LABELS:
        log.warning("Label '%s' not in allowed set, skipping.", label)
        return
    if existing_labels and label in existing_labels:
        log.debug("Label '%s' already on %s — skipping.", label, email_id)
        return
    exec_gog("gmail", "labels", "modify", email_id, "--add", label)

# ─── AI Categorization ────────────────────────────────────────────────────────

def call_stepfun_batch(emails_chunk: list) -> list[dict]:
    """First-pass batch call: subject + sender only."""
    payload = json.dumps({
        "model":       STEP_MODEL,
        "temperature": 0.1,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user",   "content": USER_PROMPT_TEMPLATE.format(
                email_json=json.dumps(
                    [{"subject": e.get("subject", ""), "from": e.get("from", "")}
                     for e in emails_chunk],
                    indent=2
                )
            )}
        ]
    }).encode()

    req = urllib.request.Request(
        STEP_BASE_URL, data=payload,
        headers={"Authorization": f"Bearer {STEP_API_KEY}", "Content-Type": "application/json"},
        method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            parsed = parse_ai_response(json.loads(resp.read())["choices"][0]["message"]["content"])
            if parsed:
                return [r for r in parsed.get("results", []) if r.get("category") in ALLOWED_LABELS]
    except urllib.error.HTTPError as e:
        log.error("StepFun batch HTTP %s", e.code)
    except Exception as e:
        log.error("StepFun batch error: %s", e)
    return []

def call_stepfun_second_pass(email: dict) -> dict:
    """
    Second-pass single call with snippet included. (#3)
    Only invoked when first-pass confidence < CONFIDENCE_THRESHOLD.
    """
    payload = json.dumps({
        "model":       STEP_MODEL,
        "temperature": 0.05,
        "messages": [
            {"role": "system", "content": SECOND_PASS_PROMPT},
            {"role": "user",   "content": SECOND_PASS_TEMPLATE.format(
                subject=email.get("subject", ""),
                sender=email.get("from", ""),
                snippet=email.get("snippet", "(no snippet)")
            )}
        ]
    }).encode()

    req = urllib.request.Request(
        STEP_BASE_URL, data=payload,
        headers={"Authorization": f"Bearer {STEP_API_KEY}", "Content-Type": "application/json"},
        method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            parsed = parse_ai_response(json.loads(resp.read())["choices"][0]["message"]["content"])
            if parsed and parsed.get("category") in ALLOWED_LABELS:
                return parsed
    except urllib.error.HTTPError as e:
        log.error("StepFun second-pass HTTP %s", e.code)
    except Exception as e:
        log.error("StepFun second-pass error: %s", e)
    return {}

def ai_categorize(emails: list, stats: dict) -> dict[str, dict]:
    """
    Full categorization pipeline. Returns {email_id: {"category": str, "confidence": float}}

    Pass 1: Cache lookup  — free, instant
    Pass 2: Batch AI      — subject + sender, cheap
    Pass 3: Second-pass   — snippet included, only for low-confidence (#3)
    """
    result   = {}
    needs_ai = []

    # Pass 1: cache
    for email in emails:
        eid    = email.get("id")
        sender = email.get("from", "")
        domain = sender.split("@")[-1].lower() if "@" in sender else ""
        cached = dominant_category(domain, stats)
        if cached:
            log.info("Cache ✓  %s → %s", domain, cached)
            result[eid] = {"category": cached, "confidence": 1.0}
        else:
            needs_ai.append(email)

    log.info("%d from cache, %d → AI.", len(result), len(needs_ai))

    # Pass 2: batch first-pass
    low_confidence = []
    for i in range(0, len(needs_ai), CHUNK_SIZE):
        chunk      = needs_ai[i: i + CHUNK_SIZE]
        ai_results = call_stepfun_batch(chunk)
        subj_map   = {e.get("subject", ""): e for e in chunk}

        for r in ai_results:
            email = subj_map.get(r.get("subject", ""))
            if not email:
                continue
            eid        = email.get("id")
            confidence = float(r.get("confidence", 1.0))
            result[eid] = {"category": r["category"], "confidence": confidence}
            if confidence < CONFIDENCE_THRESHOLD:
                log.info("Low confidence %.2f — queuing second pass: '%s'",
                         confidence, r.get("subject", "")[:50])
                low_confidence.append(email)

        # Fallback for emails the AI didn't return at all
        for email in chunk:
            if email.get("id") not in result:
                result[email.get("id")] = {"category": "Personal", "confidence": 0.0}
                low_confidence.append(email)

    # Pass 3: second pass for low-confidence (#3)
    if low_confidence:
        log.info("Running second pass for %d emails.", len(low_confidence))
        for email in low_confidence:
            eid = email.get("id")
            r2  = call_stepfun_second_pass(email)
            if r2:
                new_conf = float(r2.get("confidence", 0.5))
                old_conf = result.get(eid, {}).get("confidence", 0.0)
                if new_conf >= old_conf:
                    result[eid] = {"category": r2["category"], "confidence": new_conf}
                    log.info("Second pass → %s (%.2f) for '%s'",
                             r2["category"], new_conf, email.get("subject", "")[:50])

    return result

# ─── Email Flag Detection ──────────────────────────────────────────────────────

_MEETING_KW = {"meet", "zoom", "google meet", "calendar", "schedule",
               "event", "conference call", "invitation", "invite"}

_REPLY_KW   = {"question", "follow up", "feedback", "review", "interview",
               "confirmation", "please reply", "rsvp", "action required",
               "response needed", "awaiting", "your thoughts"}

_URGENT_KW  = {"failed", "failure", "declined", "suspended", "compromised",
               "unauthorized", "locked", "blocked", "immediate", "urgent",
               "critical", "security alert", "suspicious"}

# (#6) — dedicated ToDo keyword set, checked against subject + snippet
_TODO_KW    = {"please complete", "please review", "please approve", "please sign",
               "deadline", "due by", "due date", "by eod", "by cob",
               "action needed", "task assigned", "reminder:", "approval needed",
               "your signature", "fill out", "submit by", "respond by",
               "please fill", "please submit", "requires your"}

def classify_flags(subject: str, snippet: str = "") -> dict:
    combined = (subject + " " + snippet).lower()
    sl       = subject.lower()
    return {
        "is_meeting":  any(k in sl       for k in _MEETING_KW),
        "needs_reply": any(k in sl       for k in _REPLY_KW),
        "is_urgent":   any(k in combined for k in _URGENT_KW),
        "is_todo":     any(k in combined for k in _TODO_KW),
    }

def resolve_category(category: str, flags: dict) -> str:
    """
    Post-AI override layer using keyword flags.
    Priority > AI decision > ToDo promotion (#6).
    """
    if flags["is_urgent"] and category not in ("Priority", "Security"):
        return "Priority"
    # Promote generic categories to ToDo when explicit action keywords detected (#6)
    if flags["is_todo"] and category in ("Personal", "Work", "Ads"):
        return "ToDo"
    return category

# ─── Draft Replies ────────────────────────────────────────────────────────────

def draft_reply(email_id: str, subject: str, sender: str):
    path = DRAFTS_DIR / f"{email_id}_draft.txt"
    if path.exists():
        return  # Don't overwrite an existing draft
    path.write_text(
        f"To: {sender}\nSubject: Re: {subject}\n\n"
        f"[Draft reply — edit and send via Gmail]\n\n"
        f"---\nOriginal:\nFrom: {sender}\nSubject: {subject}\n"
    )
    log.info("Draft saved: %s", path.name)

# ─── Main Processing ──────────────────────────────────────────────────────────

def process(emails: list) -> tuple[int, int]:
    ensure_dirs()
    conn  = init_db()
    stats = load_sender_stats(conn)

    categorized = ai_categorize(emails, stats)
    urgent_list = []
    now         = datetime.now(timezone.utc).isoformat()

    for email in emails:
        eid      = email.get("id")
        sender   = email.get("from", "")
        subject  = email.get("subject", "")
        snippet  = email.get("snippet", "")
        flags    = classify_flags(subject, snippet)

        ai_info    = categorized.get(eid, {"category": "Personal", "confidence": 0.0})
        category   = resolve_category(ai_info["category"], flags)
        confidence = ai_info["confidence"]

        # Label deduplication (#4):
        # First check DB (free). If category matches, we already applied it before.
        # Only call gog to fetch Gmail labels when DB says it's a new/changed category.
        db_category = get_db_category(conn, eid)
        if db_category == category:
            existing = {category}   # We know it's already there — skip the gog call
        else:
            existing = get_email_labels(eid)

        apply_label(eid, category, existing_labels=existing)

        # Sender stats rolling update (#5)
        update_sender_stats(conn, stats, sender, category)

        # Persist to SQLite (#9)
        upsert_email(conn, {
            "id":          eid,
            "sender":      sender,
            "subject":     subject,
            "snippet":     snippet,
            "date":        email.get("date"),
            "category":    category,
            "confidence":  confidence,
            "is_meeting":  int(flags["is_meeting"]),
            "needs_reply": int(flags["needs_reply"]),
            "is_urgent":   int(flags["is_urgent"]),
            "is_todo":     int(flags["is_todo"]),
            "processed_at": now,
        })

        if category == "Priority":
            urgent_list.append({"subject": subject, "from": sender, "date": email.get("date")})

        if flags["needs_reply"]:
            draft_reply(eid, subject, sender)

        domain = sender.split("@")[-1] if "@" in sender else sender
        log.info("[%-14s | %.2f] %-20s | %s", category, confidence, domain[:20], subject[:50])

    conn.commit()
    conn.close()

    save_json(URGENT_PATH, urgent_list)
    return len(emails), len(urgent_list)

# ─── Handy Query Shortcuts (importable by other scripts) ──────────────────────

def query(sql: str, params=()):
    """Ad-hoc SQLite queries. Example: query('SELECT * FROM emails WHERE category=?', ('Priority',))"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    rows = conn.execute(sql, params).fetchall()
    conn.close()
    return [dict(r) for r in rows]

def recent_priority(days: int = 7):
    return query(
        "SELECT subject, sender, date FROM emails "
        "WHERE category='Priority' AND processed_at >= datetime('now', ?)"
        "ORDER BY date DESC",
        (f"-{days} days",)
    )

def category_summary():
    return query(
        "SELECT category, COUNT(*) as count, ROUND(AVG(confidence),2) as avg_confidence "
        "FROM emails GROUP BY category ORDER BY count DESC"
    )

# ─── Entry Point ──────────────────────────────────────────────────────────────

if __name__ == "__main__":
    if not STEP_API_KEY:
        log.error("STEP_API_KEY not set. Export it before running.")
        sys.exit(1)

    emails = get_unread_emails()
    if not emails:
        print("NO_NEW_MAILS")
        sys.exit(0)

    total, urgent = process(emails)
    print(f"MAIL_CHECK_COMPLETE: {total} processed, {urgent} urgent.")
