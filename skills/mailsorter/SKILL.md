---
name: mailsorter
version: 3.0.0
description: "Executive mail sorting and categorization agent"
homepage: https://github.com/denniarems/fridayclaw
immutable: false
metadata: {"emoji":"📧","category":"productivity"}
---
# Mail Sorter
Automated email sorting and categorization agent for Denny's workflow.
Powered by StepFun AI with a multi-pass categorization pipeline, rolling sender reputation learning, and SQLite-backed history.

## What It Does
- Checks Gmail for unread emails at regular intervals
- Categorizes emails into: `Priority`, `Work`, `Finance Mails`, `Security`, `Keys`, `Ads`, `ToDo`, `Personal`
- Two-pass AI categorization — low-confidence results are re-evaluated with email snippet for higher accuracy
- Learns sender reputation via a rolling decay window (last 30 observations per domain) — trusted domains skip the AI call entirely
- Deduplicates Gmail labels before applying — never double-tags an already-labeled email
- Detects `ToDo` emails from explicit action keywords in subject and snippet (`deadline`, `please approve`, `respond by`, etc.)
- Detects meetings (Google Meet, Zoom, interviews) and flags them
- Drafts reply stubs for emails that need a response
- Notifies about urgent/priority emails
- Persists all processed emails to SQLite for queryable history

## Files
- `mail_processor.py` — Main processing script
- `HEARTBEAT.md` — Heartbeat configuration for regular checks

## Architecture

### Categorization Pipeline (3 passes)
```
1. Cache lookup   → dominant_category() from rolling sender stats (free, instant)
2. Batch AI call  → subject + sender only, chunked at 10 emails per request
3. Second pass    → snippet included, only for confidence < 0.75 or AI non-returns
```

### Sender Stats Decay
Each domain keeps a rolling list of its last 30 category assignments.
Older observations age out automatically — stale behavior corrects itself over time.
A domain qualifies for cache-only routing when ≥ 3 observations exist and top category ≥ 70%.

### Label Deduplication
Before applying a Gmail label, the processor checks local SQLite first (free).
Only calls the Gmail API when the stored category differs from the new one.

### ToDo Detection
Dedicated keyword set checked against subject + snippet:
`deadline`, `due by`, `please approve`, `please sign`, `respond by`, `approval needed`, `fill out`, `submit by`, and more.
Overrides `Personal`, `Work`, or `Ads` when explicit action language is found.

## Storage

| Location | Purpose |
|---|---|
| `~/.openclaw/workspace/memory/emails.db` | SQLite — full email history, sender stats |
| `~/.openclaw/workspace/memory/urgent_emails.json` | Latest urgent emails list |
| `~/.openclaw/workspace/mail_drafts/<id>_draft.txt` | Reply stubs |

### Useful SQLite Queries
```python
from mail_processor import query, recent_priority, category_summary

# All Priority emails from the last 7 days
recent_priority(days=7)

# Category breakdown with average AI confidence
category_summary()

# Custom query
query("SELECT * FROM emails WHERE is_todo=1 ORDER BY date DESC LIMIT 20")
```

## Configuration

| Variable | Default | Description |
|---|---|---|
| `MAX_EMAILS` | 20 | Max unread emails per run |
| `CHUNK_SIZE` | 10 | Emails per AI batch call |
| `CONFIDENCE_THRESHOLD` | 0.75 | Below this → second pass with snippet |
| `STATS_WINDOW` | 30 | Rolling window size for sender decay |

## Usage

Manual run:
```bash
STEP_API_KEY=your_key python3 /home/denny/.openclaw/workspace/mail_processor.py
```

Import for querying history:
```python
from mail_processor import recent_priority, category_summary, query
```

## Output
- Email history: `/home/denny/.openclaw/workspace/memory/emails.db`
- Urgent list: `/home/denny/.openclaw/workspace/memory/urgent_emails.json`
- Reply drafts: `/home/denny/.openclaw/workspace/mail_drafts/<id>_draft.txt`

## Integration
Part of the FridayClaw ecosystem — a digital assistant with chaotic good energy 🕊
