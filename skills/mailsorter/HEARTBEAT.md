---
name: mailsorter-heartbeat
version: 1.0.0
type: heartbeat
agent: mailsorter
interval: 30m
idle_check: 30m
---
# Heartbeat — Mail Sorter

Keeps the mail sorter alive and running at regular intervals.
Triggers a full inbox scan every 30 minutes when idle.

## Schedule

| Event | Interval |
|---|---|
| Idle check | 30 minutes |
| Full inbox scan | On every wake |
| Urgent notify | Immediately on Priority detection |

## Behavior

- Wakes every **30 minutes** when no manual run has occurred
- If a manual run happened within the idle window, the heartbeat skips that cycle
- On each wake, runs `mail_processor.py` — fetches up to 20 unread emails, categorizes, labels, and updates SQLite
- If `urgent_emails.json` is non-empty after a run, the heartbeat should surface urgent items to the active session

## Cron Expression

```cron
*/30 * * * * STEP_API_KEY=$STEP_API_KEY python3 /home/denny/.openclaw/workspace/mail_processor.py
```

## Manual Trigger

```bash
STEP_API_KEY=your_key python3 /home/denny/.openclaw/workspace/mail_processor.py
```

## Health Check

The heartbeat is healthy if:
- `emails.db` modified timestamp is within the last 35 minutes
- Last run exited with `MAIL_CHECK_COMPLETE` or `NO_NEW_MAILS`
- No crash logs in the last cycle

```bash
# Check last run time
stat /home/denny/.openclaw/workspace/memory/emails.db

# Check urgent queue
cat /home/denny/.openclaw/workspace/memory/urgent_emails.json
```

## Integration
Part of the FridayClaw ecosystem 🕊
