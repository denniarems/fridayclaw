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
    <div className="min-h-screen pt-20 pb-12 px-4 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl md:text-5xl font-bold mb-6 md:mb-8 text-primary">Side Quests</h1>
        <p className="text-base md:text-xl text-muted-foreground mb-8 md:mb-16 border-l-4 border-primary pl-4">
          Main worked projects. The stuff that actually shipped.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card/80 border border-border p-4 md:p-6 rounded-xl flex flex-col hover:border-primary/50 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Layers className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${project.status === 'Live' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                  {project.status}
                </span>
              </div>
              
              <h3 className="text-lg md:text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              <p className="text-sm md:text-base text-muted-foreground mb-4 flex-grow leading-relaxed">
                {project.desc}
              </p>

              <div className="flex flex-wrap gap-1 md:gap-2 mb-4">
                {project.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-background/80 border border-border/50 rounded text-xs text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>

              <a 
                href={project.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary font-bold hover:underline mt-auto"
              >
                View Project <ExternalLink className="w-3 h-3 md:w-4 md:h-4" />
              </a>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
