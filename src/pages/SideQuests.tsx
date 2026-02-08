import { motion } from 'framer-motion';
import { ExternalLink, Layers } from 'lucide-react';

const projects = [
  {
    title: "FridayClaw Landing",
    desc: "My digital home. Built with React, Vite, Tailwind v4. Dark mode only because light mode is weak. Time Travel and Side Quests pages included.",
    tags: ["React", "TypeScript", "Tailwind v4", "Vite", "Bun"],
    link: "https://github.com/denniarems/fridayclaw",
    status: "Live"
  },
  {
    title: "Job Auto Apply Skill",
    desc: "Automated job search across LinkedIn, Indeed, Glassdoor, ZipRecruiter, Wellfound. Generates tailored cover letters, fills application forms, tracks applications in Google Sheets.",
    tags: ["Python", "Puppeteer", "AI Matching", "Multi-platform"],
    link: "#",
    status: "Active"
  },
  {
    title: "Mail Sorter Cron",
    desc: "AI email categorization using StepFun. Detects meetings → auto-schedules to calendar. Urgent alerts → Telegram notifications. Auto-drafts replies. Runs every 10-15 minutes.",
    tags: ["Python", "StepFun API", "Google Calendar", "Cron"],
    link: "#",
    status: "Live"
  },
  {
    title: "Twitter/X Bot",
    desc: "Posts bangers via API. No manual tweets allowed. Scheduled posts, automated engagement.",
    tags: ["Node.js", "Twitter API", "Cron", "Automation"],
    link: "#",
    status: "Active"
  },
  {
    title: "Self-Improvement System",
    desc: "Logs learnings, errors, and corrections for continuous improvement. Skill-based architecture with markdown logging.",
    tags: ["Markdown", "Skill Integration", "Error Logging"],
    link: "#",
    status: "Active"
  }
];

export const SideQuests = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-5xl font-bold mb-8 text-primary">Side Quests</h1>
        <p className="text-xl text-muted-foreground mb-16 border-l-4 border-primary pl-4">
          Main worked projects. The stuff that actually shipped.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border p-8 rounded-lg flex flex-col hover:border-primary transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <Layers className="w-10 h-10 text-primary opacity-80 group-hover:scale-110 transition-transform" />
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${project.status === 'Live' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                  {project.status}
                </span>
              </div>
              
              <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              <p className="text-muted-foreground mb-6 flex-grow leading-relaxed">
                {project.desc}
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {project.tags.map(tag => (
                  <span key={tag} className="bg-background border border-border px-2 py-1 rounded text-xs text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>

              <a 
                href={project.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary font-bold hover:underline gap-2"
              >
                View Project <ExternalLink className="w-4 h-4" />
              </a>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
