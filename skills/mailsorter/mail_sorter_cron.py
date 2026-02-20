#!/usr/bin/env python3
import os
import json
import subprocess
import re
import sys
import urllib.request
import urllib.error

# Configuration
GOG_ACCOUNT = "denniarems@gmail.com"
GOG_KEYRING_PASSWORD = "google_key"
SENDER_STATS_PATH = "/home/denny/.openclaw/workspace/memory/sender_stats.json"
MAX_EMAILS = 10
ALLOWED_LABELS = ["Finance Mails", "Keys", "Personal", "Priority", "Security", "ToDo", "Work", "Ads"]

# StepFun config
STEP_API_KEY = os.getenv("STEP_API_KEY")
STEP_BASE_URL = "https://api.stepfun.ai/v1/chat/completions"
STEP_MODEL = "step-3.5-flash"

CATEGORIZE_PROMPT = """You are an email categorization expert. Analyze these emails carefully and categorize each one into EXACTLY one of these categories:
- Priority: urgent, time-sensitive, interviews, job offers, critical deadlines, FAILED payments, large incoming transfers, suspicious login/activity alerts.
- Work: projects, meetings, professional discussions, job alerts, status updates.
- Finance Mails: routine bills, invoices, monthly statements, subscription renewals, small/routine transaction receipts.
- Security: passwords, verification codes, 2FA, API keys, identity confirmation (unless suspicious -> Priority).
- Ads: marketing emails, promotional content, newsletters, unsubscribe-heavy emails.
- Personal: general interest, personal messages, everything else.

Respond with ONLY valid JSON, no markdown:
{"categorizations": [{"subject": "...", "category": "..."}]}"""

def exec_command(cmd, env=None):
    if env is None:
        env = os.environ.copy()
    env["GOG_KEYRING_PASSWORD"] = GOG_KEYRING_PASSWORD
    result = subprocess.run(cmd, env=env, capture_output=True, text=True)
    if result.returncode != 0:
        return None
    return result.stdout

def get_unread_emails(limit=MAX_EMAILS):
    cmd = ["gog", "gmail", "search", "is:unread", f"--max={limit}", f"--account={GOG_ACCOUNT}", "--json"]
    output = exec_command(cmd)
    if output:
        try:
            data = json.loads(output)
            return data.get("threads", [])
        except:
            return []
    return []

def apply_label(email_id, label):
    cmd = ["gog", "gmail", "labels", "modify", email_id, "--add", label, f"--account={GOG_ACCOUNT}"]
    exec_command(cmd)

def categorize_with_stepfun(emails_list):
    """Use StepFun API to categorize emails in chunks."""
    if not emails_list or not STEP_API_KEY:
        print("DEBUG: No emails or API key missing")
        return {}
    
    categorizations = {}
    chunk_size = 10
    
    # Process in chunks of 10 to avoid timeouts
    for i in range(0, len(emails_list), chunk_size):
        chunk = emails_list[i:i+chunk_size]
        print(f"DEBUG: Processing chunk {i//chunk_size + 1} ({len(chunk)} emails)")
        
        # Build email list for prompt
        emails_for_ai = [
            {"subject": email.get("subject", ""), "from": email.get("from", "")}
            for email in chunk
        ]
        
        email_text = json.dumps(emails_for_ai, indent=2)
        full_prompt = f"{CATEGORIZE_PROMPT}\n\nEmails to categorize:\n{email_text}"
        
        try:
            payload = json.dumps({
                "model": STEP_MODEL,
                "messages": [
                    {
                        "role": "system",
                        "content": "You are an email categorization expert. Return only valid JSON."
                    },
                    {
                        "role": "user",
                        "content": full_prompt
                    }
                ],
                "temperature": 0.3
            }).encode('utf-8')
            
            req = urllib.request.Request(
                STEP_BASE_URL,
                data=payload,
                headers={
                    "Authorization": f"Bearer {STEP_API_KEY}",
                    "Content-Type": "application/json"
                },
                method="POST"
            )
            
            with urllib.request.urlopen(req, timeout=30) as response:
                data = json.loads(response.read().decode())
                
                if "choices" not in data or len(data["choices"]) == 0:
                    print(f"DEBUG: No choices in response for chunk {i//chunk_size + 1}")
                    continue
                
                message = data["choices"][0].get("message", {})
                content = message.get("content", "")
                
                # Parse JSON from response
                try:
                    result = json.loads(content)
                    for item in result.get("categorizations", []):
                        categorizations[item["subject"]] = item["category"]
                except json.JSONDecodeError:
                    print(f"DEBUG: Failed to parse chunk {i//chunk_size + 1}")
                    continue
                
        except urllib.error.HTTPError as e:
            print(f"DEBUG: HTTP error on chunk {i//chunk_size + 1}: {e.code}")
            continue
        except Exception as e:
            print(f"DEBUG: Error on chunk {i//chunk_size + 1}: {e}")
            continue
    
    print(f"DEBUG: Total categorizations: {len(categorizations)}")
    return categorizations

def is_meeting_email(subject, sender):
    """Detect if email contains a meeting invite."""
    meeting_keywords = ["meet", "zoom", "google meet", "calendar", "schedule", "event", "conference call", "invitation"]
    return any(word in subject.lower() for word in meeting_keywords)

def needs_reply(subject, sender):
    """Detect if email likely needs a reply."""
    question_keywords = ["question", "follow up", "feedback", "review", "interview", "confirmation", "please reply", "rsvp", "action required"]
    return any(word in subject.lower() for word in question_keywords)

def draft_reply(email_id, subject, sender):
    """Create a draft reply for emails that need responses."""
    os.makedirs("/home/denny/.openclaw/workspace/mail_drafts", exist_ok=True)
    
    draft_content = f"""To: {sender}
Subject: Re: {subject}

[Draft reply - edit and send via Gmail]

---
Original message:
From: {sender}
Subject: {subject}
"""
    
    draft_file = f"/home/denny/.openclaw/workspace/mail_drafts/{email_id}_draft.txt"
    with open(draft_file, "w") as f:
        f.write(draft_content)

def categorize_and_process(emails):
    if not emails:
        return 0, 0
    
    print(f"DEBUG: Processing {len(emails)} unread emails.")
    
    # Get AI categorizations for all emails at once
    categorizations = categorize_with_stepfun(emails)
    
    email_summaries = []
    urgent_list = []
    
    for email in emails:
        email_id = email.get("id")
        sender = email.get("from", "")
        subject = email.get("subject", "")
        
        # Get category from AI or default to Personal
        category = categorizations.get(subject, "Personal")
        is_meeting = is_meeting_email(subject, sender)
        needs_reply_flag = needs_reply(subject, sender)
        is_urgent = category == "Priority"
        
        summary = {
            "id": email_id,
            "from": sender,
            "subject": subject,
            "snippet": email.get("snippet"),
            "date": email.get("date"),
            "category": category,
            "is_meeting": is_meeting,
            "needs_reply": needs_reply_flag,
            "is_urgent": is_urgent
        }
        email_summaries.append(summary)
        
        # Apply category label
        apply_label(email_id, category)
        
        # Track urgent emails
        if is_urgent:
            urgent_list.append({
                "subject": subject,
                "from": sender,
                "date": email.get("date")
            })
        
        # Draft reply for flagged emails
        if needs_reply_flag:
            draft_reply(email_id, subject, sender)
    
    # Save findings
    with open("/home/denny/.openclaw/workspace/memory/last_mail_check.json", "w") as f:
        json.dump(email_summaries, f, indent=2)
    
    # Save urgent list for notification
    with open("/home/denny/.openclaw/workspace/memory/urgent_emails.json", "w") as f:
        json.dump(urgent_list, f, indent=2)
    
    return len(email_summaries), len(urgent_list)

if __name__ == "__main__":
    emails = get_unread_emails()
    if emails:
        total, urgent_count = categorize_and_process(emails)
        print(f"MAIL_CHECK_COMPLETE: {total} emails processed, {urgent_count} urgent.")
    else:
        print("NO_NEW_MAILS")
