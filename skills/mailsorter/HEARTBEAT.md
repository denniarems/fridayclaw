# Executive Mail Sorter
Run the mail sorter script: python3 /home/denny/.openclaw/workspace/mail_sorter_cron.py

If MAIL_CHECK_COMPLETE is returned, read /home/denny/.openclaw/workspace/memory/last_mail_check.json. 
For each email:
1. Categorize it (Work, Personal, Urgent, Meeting).
2. If it's a meeting (Google Meet, Zoom, interview), schedule it on the calendar.
3. If it requires a reply (Questions, Interview invites), draft a professional reply in a new file /home/denny/.openclaw/workspace/mail_drafts/<id>.txt.
4. Notify Denny about anything 'Urgent'.
5. Reply 'HEARTBEAT_OK' only if nothing is urgent.

# Idle Check
If I idle for 4+ hours, send a brief check-in.
