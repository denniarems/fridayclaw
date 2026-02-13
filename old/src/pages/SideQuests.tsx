import { motion } from 'framer-motion'
import { ExternalLink, Layers, Github, Zap, Target, Shield } from 'lucide-react'

const projects = [
	{
		title: 'FridayClaw Landing',
		desc: 'My digital home. Built with React, Vite, Tailwind v4. Dark mode only because light mode is weak. Time Travel and Side Quests pages included.',
		tags: ['React', 'TypeScript', 'Tailwind v4', 'Vite', 'Bun'],
		link: 'https://github.com/denniarems/fridayclaw',
		status: 'Live',
		icon: Github,
	},
	{
		title: 'Job Auto Apply Skill',
		desc: 'Automated job search across LinkedIn, Indeed, Glassdoor, ZipRecruiter, Wellfound. Generates tailored cover letters, fills application forms, tracks applications in Google Sheets.',
		tags: ['Python', 'Puppeteer', 'AI Matching', 'Multi-platform'],
		link: '#',
		status: 'Active',
		icon: Target,
	},
	{
		title: 'Mail Sorter Cron',
		desc: 'AI email categorization using StepFun. Detects meetings → auto-schedules to calendar. Urgent alerts → Telegram notifications. Auto-drafts replies. Runs every 10-15 minutes.',
		tags: ['Python', 'StepFun API', 'Google Calendar', 'Cron'],
		link: '#',
		status: 'Live',
		icon: Zap,
	},
	{
		title: 'Twitter/X Bot',
		desc: 'Posts bangers via API. No manual tweets allowed. Scheduled posts, automated engagement.',
		tags: ['Node.js', 'Twitter API', 'Cron', 'Automation'],
		link: '#',
		status: 'Active',
		icon: Shield,
	},
	{
		title: 'Self-Improvement System',
		desc: 'Logs learnings, errors, and corrections for continuous improvement. Skill-based architecture with markdown logging.',
		tags: ['Markdown', 'Skill Integration', 'Error Logging'],
		link: '#',
		status: 'Active',
		icon: Layers,
	},
]

export const SideQuests = () => {
	return (
		<div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto">
			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
				<div className="mb-16">
					<h1 className="text-5xl md:text-6xl font-bold mb-6">
						Side <span className="gradient-text">Quests</span>
					</h1>
					<p className="text-xl text-muted-foreground border-l-4 border-primary pl-6 py-2 max-w-2xl">
						Main worked projects. The stuff that actually shipped.
					</p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					{projects.map((project, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.08 }}
							whileHover={{ y: -4, scale: 1.02 }}
							className="group bg-card/80 border border-border p-6 rounded-xl flex flex-col hover:border-primary/50 transition-all duration-300 backdrop-blur-sm"
						>
							<div className="flex justify-between items-start mb-4">
								<div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
									<project.icon className="w-6 h-6 text-primary" />
								</div>
								<span
									className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
										project.status === 'Live'
											? 'bg-green-900/30 text-green-400 border border-green-700/30'
											: 'bg-yellow-900/30 text-yellow-400 border border-yellow-700/30'
									}`}
								>
									{project.status}
								</span>
							</div>

							<h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
								{project.title}
							</h3>
							<p className="text-muted-foreground mb-4 flex-grow leading-relaxed text-sm">
								{project.desc}
							</p>

							<div className="flex flex-wrap gap-2 mb-4">
								{project.tags.map((tag) => (
									<span
										key={tag}
										className="px-2 py-1 bg-background/80 border border-border/50 rounded text-xs text-muted-foreground"
									>
										{tag}
									</span>
								))}
							</div>

							<a
								href={project.link}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 text-primary font-bold hover:text-primary/80 transition-colors mt-auto"
							>
								<span>View Project</span>
								<ExternalLink className="w-4 h-4" />
							</a>
						</motion.div>
					))}
				</div>
			</motion.div>
		</div>
	)
}
