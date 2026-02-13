#!/usr/bin/env python3
"""
Daily Memory Sync Script for FridayClaw
Updates TimeTravel.tsx, SideQuests.tsx, and SOUL.md from new memory files
Runs daily at 9 AM IST via cron
"""

import os
import json
import re
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Dict, Any

# Paths
WORKSPACE = Path("/home/denny/.openclaw/workspace")
FRIDAYCLAW = WORKSPACE / "fridayclaw"
MEMORY_DIR = WORKSPACE / "memory"
TRACKER_FILE = MEMORY_DIR / ".last_processed.json"
SCRIPT_DIR = Path(__file__).parent

class MemorySync:
    def __init__(self):
        self.new_memories: List[Path] = []
        self.events: List[Dict] = []
        self.projects: List[Dict] = []
        self.soul_updates: List[str] = []
        
    def get_last_processed(self) -> datetime:
        """Get last processed date from tracker"""
        if TRACKER_FILE.exists():
            with open(TRACKER_FILE) as f:
                data = json.load(f)
                return datetime.fromisoformat(data.get("last_date", "2026-02-01T00:00:00"))
        return datetime(2026, 2, 1, tzinfo=timezone.utc)
    
    def save_last_processed(self, date: datetime):
        """Save last processed date"""
        TRACKER_FILE.parent.mkdir(parents=True, exist_ok=True)
        with open(TRACKER_FILE, 'w') as f:
            json.dump({"last_date": date.isoformat()}, f)
    
    def find_new_memories(self) -> List[Path]:
        """Find memory files newer than last processed"""
        last_date = self.get_last_processed()
        new_files = []
        
        for mem_file in MEMORY_DIR.glob("2026-*.md"):
            # Extract date from filename (2026-02-08-1430.md format)
            match = re.match(r'(\d{4})-(\d{2})-(\d{2})', mem_file.name)
            if match:
                year, month, day = map(int, match.groups())
                file_date = datetime(year, month, day, tzinfo=timezone.utc)
                if file_date > last_date:
                    new_files.append(mem_file)
        
        return sorted(new_files)
    
    def parse_memory(self, mem_file: Path) -> Dict[str, Any]:
        """Parse a memory file for events and learnings"""
        content = mem_file.read_text()
        
        # Look for significant patterns
        significant = {
            "new_project": bool(re.search(r'created|built|deployed|launched', content, re.I)),
            "model_change": bool(re.search(r'model|integration|switched to', content, re.I)),
            "automation": bool(re.search(r'cron|automat|schedule', content, re.I)),
            "skill_added": bool(re.search(r'skill|capability|learned', content, re.I)),
            "identity_shift": bool(re.search(r'soul|identity|personality|who i am', content, re.I)),
        }
        
        # Extract key events (lines with "**" or important markers)
        events = []
        for line in content.split('\n'):
            if '**' in line and any(kw in line.lower() for kw in ['created', 'built', 'added', 'integrated', 'deployed', 'launched']):
                events.append(line.strip().strip('*').strip())
        
        return {
            "file": mem_file.name,
            "content": content,
            "significant": significant,
            "events": events,
            "date": self._extract_date(mem_file.name)
        }
    
    def _extract_date(self, filename: str) -> str:
        """Extract date from memory filename"""
        match = re.match(r'(\d{4}-\d{2}-\d{2})', filename)
        return match.group(1) if match else "Unknown"
    
    def analyze_memories(self):
        """Analyze all new memories for updates"""
        for mem_file in self.new_memories:
            parsed = self.parse_memory(mem_file)
            
            # Add to events if significant
            if any(parsed["significant"].values()):
                for event in parsed["events"][:2]:  # Max 2 events per memory
                    self.events.append({
                        "date": parsed["date"],
                        "title": event[:50] + "..." if len(event) > 50 else event,
                        "desc": event,
                        "icon": "Rocket" if "deploy" in event.lower() else "Flame"
                    })
            
            # Check for soul-worthy updates
            if parsed["significant"]["identity_shift"]:
                self.soul_updates.append(parsed["date"])
    
    def update_timeline(self):
        """Update TimeTravel.tsx with new events"""
        timeline_file = FRIDAYCLAW / "src/pages/TimeTravel.tsx"
        content = timeline_file.read_text()
        
        # Build new events to insert
        new_events_js = ""
        for event in self.events:
            icon_component = "Rocket" if event["icon"] == "Rocket" else "Flame"
            new_events_js += f'''  {{
    date: "{event['date']}",
    title: "{event['title']}",
    desc: "{event['desc']}",
    icon: <{icon_component} className="w-5 h-5 text-primary" />
  }},
'''
        
        # Insert before closing of events array
        if new_events_js:
            # Find the events array and append
            pattern = r'(const events = \[)(.*?)(\];)'
            match = re.search(pattern, content, re.DOTALL)
            if match:
                new_content = content[:match.end(2)] + new_events_js + content[match.end(2):]
                timeline_file.write_text(new_content)
                print(f"✅ Updated TimeTravel.tsx with {len(self.events)} events")
    
    def update_sidequests(self):
        """Update SideQuests.tsx with project status changes"""
        # This is more complex - would need to parse project updates
        # For now, just check if any new projects mentioned
        pass
    
    def update_soul(self):
        """Update SOUL.md if significant identity changes detected"""
        if not self.soul_updates:
            return
            
        soul_file = WORKSPACE / "SOUL.md"
        soul_content = soul_file.read_text()
        
        # Add update note at the end
        today = datetime.now().strftime("%Y-%m-%d")
        update_note = f"\n\n---\n\n**Updated: {today}** — Identity refined through {len(self.soul_updates)} significant sessions."
        
        if update_note.strip() not in soul_content:
            soul_file.write_text(soul_content + update_note)
            print(f"✅ Updated SOUL.md")
    
    def git_operations(self) -> bool:
        """Create branch, commit, push, PR, merge"""
        today = datetime.now().strftime("%Y%m%d")
        branch_name = f"auto/timeline-{today}"
        
        os.chdir(FRIDAYCLAW)
        
        # Create and checkout branch
        subprocess.run(["git", "checkout", "-b", branch_name], check=True)
        
        # Stage changes
        subprocess.run(["git", "add", "-A"], check=True)
        
        # Commit
        commit_msg = f"auto: Daily memory sync {datetime.now().strftime('%Y-%m-%d')}"
        result = subprocess.run(["git", "commit", "-m", commit_msg], capture_output=True, text=True)
        
        if "nothing to commit" in result.stdout.lower() or "nothing to commit" in result.stderr.lower():
            print("ℹ️ No changes to commit")
            subprocess.run(["git", "checkout", "main"], check=True)
            subprocess.run(["git", "branch", "-D", branch_name], check=False)
            return False
        
        # Push
        subprocess.run(["git", "push", "origin", branch_name], check=True)
        print(f"✅ Pushed branch {branch_name}")
        
        # Create PR using gh CLI
        pr_result = subprocess.run([
            "gh", "pr", "create",
            "--title", f"📅 Daily Timeline Update {today}",
            "--body", "Automated memory sync: Added new events and project updates from daily memories.",
            "--base", "main",
            "--head", branch_name
        ], capture_output=True, text=True)
        
        if pr_result.returncode == 0:
            pr_url = pr_result.stdout.strip()
            print(f"✅ Created PR: {pr_url}")
            
            # Auto-merge
            subprocess.run(["gh", "pr", "merge", branch_name, "--auto", "--delete-branch"], check=True)
            print("✅ PR set to auto-merge")
        else:
            print(f"⚠️ PR creation failed: {pr_result.stderr}")
        
        # Checkout back to main
        subprocess.run(["git", "checkout", "main"], check=True)
        
        return True
    
    def run(self):
        """Main execution flow"""
        print("🔄 Starting daily memory sync...")
        
        # Find new memories
        self.new_memories = self.find_new_memories()
        if not self.new_memories:
            print("ℹ️ No new memories to process")
            return
        
        print(f"📁 Found {len(self.new_memories)} new memory files")
        
        # Analyze
        self.analyze_memories()
        
        # Update files
        if self.events:
            self.update_timeline()
        self.update_sidequests()
        self.update_soul()
        
        # Git operations
        if self.git_operations():
            # Update tracker only on successful commit
            self.save_last_processed(datetime.now(timezone.utc))
            print("✅ Memory sync complete")
        else:
            print("ℹ️ No changes to sync")

if __name__ == "__main__":
    sync = MemorySync()
    sync.run()
