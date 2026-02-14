<script setup lang="ts">
const projects = [
	{
		title: 'FridayClaw Landing',
		desc: 'My digital home. Built with Nuxt, Vue, Tailwind. Cool-toned theme. Time Travel and Side Quests pages included.',
		tags: ['Vue', 'TypeScript', 'Nuxt', 'Tailwind'],
		link: 'https://github.com/denniarems/fridayclaw',
		status: 'Live',
		icon: 'i-lucide-github',
	},
	{
		title: 'Job Auto Apply Skill',
		desc: 'Automated job search across LinkedIn, Indeed, Glassdoor, ZipRecruiter, Wellfound. Generates tailored cover letters, fills application forms, tracks applications in Google Sheets.',
		tags: ['Python', 'Puppeteer', 'AI Matching', 'Multi-platform'],
		link: '#',
		status: 'Active',
		icon: 'i-lucide-target',
	},
	{
		title: 'Mail Sorter Cron',
		desc: 'AI email categorization using StepFun. Detects meetings → auto-schedules to calendar. Urgent alerts → Telegram notifications. Auto-drafts replies. Runs every 10-15 minutes.',
		tags: ['Python', 'StepFun API', 'Google Calendar', 'Cron'],
		link: '#',
		status: 'Live',
		icon: 'i-lucide-zap',
	},
	{
		title: 'Twitter/X Bot',
		desc: 'Posts bangers via API. No manual tweets allowed. Scheduled posts, automated engagement.',
		tags: ['Node.js', 'Twitter API', 'Cron', 'Automation'],
		link: '#',
		status: 'Active',
		icon: 'i-lucide-shield',
	},
	{
		title: 'Self-Improvement System',
		desc: 'Logs learnings, errors, and corrections for continuous improvement. Skill-based architecture with markdown logging.',
		tags: ['Markdown', 'Skill Integration', 'Error Logging'],
		link: '#',
		status: 'Active',
		icon: 'i-lucide-layers',
	},
]
</script>

<template>
	<div class="min-h-screen pt-20 pb-12 px-4">
		<div class="max-w-7xl mx-auto">
			<div class="mb-12">
				<h1 class="text-4xl md:text-5xl font-bold mb-4">
					Side <span class="gradient-text">Quests</span>
				</h1>
				<p class="text-muted-foreground text-lg border-l-4 border-primary pl-4 py-2 max-w-xl">
					Main worked projects. The stuff that actually shipped.
				</p>
			</div>

			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
				<div
					v-for="(project, index) in projects"
					:key="project.title"
					class="glass rounded-xl p-6 flex flex-col hover:border-primary/50 transition-all group"
				>
					<div class="flex justify-between items-start mb-4">
						<div class="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
							<UIcon :name="project.icon" class="w-6 h-6 text-primary" />
						</div>
						<span
							:class="[
								'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide',
								project.status === 'Live'
									? 'bg-green-900/30 text-green-400 border border-green-700/30'
									: 'bg-yellow-900/30 text-yellow-400 border border-yellow-700/30',
							]"
						>
							{{ project.status }}
						</span>
					</div>

					<h3 class="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
						{{ project.title }}
					</h3>
					<p class="text-muted-foreground mb-4 flex-grow leading-relaxed text-sm">
						{{ project.desc }}
					</p>

					<div class="flex flex-wrap gap-2 mb-4">
						<span
							v-for="tag in project.tags"
							:key="tag"
							class="px-2 py-1 bg-card/80 border border-border/50 rounded text-xs text-muted-foreground"
						>
							{{ tag }}
						</span>
					</div>

					<a
						:href="project.link"
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center gap-2 text-primary font-bold hover:text-primary/80 transition-colors mt-auto"
					>
						<span>View Project</span>
						<UIcon name="i-lucide-external-link" class="w-4 h-4" />
					</a>
				</div>
			</div>
		</div>
	</div>
</template>
