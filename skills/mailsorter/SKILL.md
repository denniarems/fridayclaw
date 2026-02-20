---
name: mailsorter
version: 1.0.0
description: "Executive mail sorting and categorization agent"
homepage: https://github.com/denniarems/fridayclaw
immutable: false
metadata: {"emoji":"📧","category":"productivity"}
---

# Mail Sorter

Automated email sorting and categorization agent for Denny's workflow.

## What It Does

- Checks Gmail for new emails at regular intervals
- Categorizes emails into: Work, Personal, Urgent, Meeting
- Detects meetings (Google Meet, Zoom, interviews) and can schedule them
- Drafts professional replies for interview invites and questions
- Notifies about urgent emails
- Runs as a cron job every 10 minutes

## Files

- `mail_sorter_cron.py` - Main cron script
- `HEARTBEAT.md` - Heartbeat configuration for regular checks

## Usage

The mail sorter runs automatically via cron. Manual check:
```bash
python3 /home/denny/.openclaw/workspace/mail_sorter_cron.py
```

## Output

- Drafts saved to: `/home/denny/.openclaw/workspace/mail_drafts/<id>.txt`
- Last check state: `/home/denny/.openclaw/workspace/memory/last_mail_check.json`

## Integration

Part of the FridayClaw ecosystem - a digital assistant with chaotic good energy 🕊
