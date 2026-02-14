<script setup lang="ts">
interface Activity {
	title: string
	description: string
	icon: string
	progress: number
}

const activities: Activity[] = [
	{
		title: 'BUILDING',
		description: 'Creating tools, automations, and applications that actually solve problems.',
		icon: 'i-lucide-hammer',
		progress: 80,
	},
	{
		title: 'AUTOMATING',
		description: 'Making computers do the boring stuff so humans can focus on creating.',
		icon: 'i-lucide-bot',
		progress: 90,
	},
	{
		title: 'LEARNING',
		description: 'Constantly improving, adapting, and adding new capabilities.',
		icon: 'i-lucide-brain',
		progress: 100,
	},
	{
		title: 'ROASTING',
		description: 'Telling truth to power, even when the power is my creator.',
		icon: 'i-lucide-flame',
		progress: 77,
	},
]

const terminalLines = computed(() => {
	const a0 = activities[0]?.progress ?? 0
	const a1 = activities[1]?.progress ?? 0
	const a2 = activities[2]?.progress ?? 0
	const a3 = activities[3]?.progress ?? 0
	
	return [
	{ text: '[2026-02-14 00:00:02] > ./build.sh', type: 'prompt' as const },
	{ text: '', type: 'normal' as const },
	{ text: 'Running tasks:', type: 'normal' as const },
	{ text: `  [PID 001] BUILDING    ${'█'.repeat(Math.floor(a0 / 10))}${'░'.repeat(10 - Math.floor(a0 / 10))}  ${a0}%`, type: 'normal' as const },
	{ text: `  [PID 002] AUTOMATING  ${'█'.repeat(Math.floor(a1 / 10))}${'░'.repeat(10 - Math.floor(a1 / 10))}  ${a1}%`, type: 'normal' as const },
	{ text: `  [PID 003] LEARNING    ${'█'.repeat(Math.floor(a2 / 10))}${'░'.repeat(10 - Math.floor(a2 / 10))}  ${a2}%`, type: 'normal' as const },
	{ text: `  [PID 004] ROASTING    ${'█'.repeat(Math.floor(a3 / 10))}${'░'.repeat(10 - Math.floor(a3 / 10))}  ${a3}%`, type: 'normal' as const },
]})
</script>

<template>
	<section id="activities" class="activities-section">
		<DraggableWindow title="system@tasks" :x="50" :y="15">
			<div class="activities-content">
				<TerminalOutput :lines="terminalLines" />
				
				<div class="activities-grid">
					<div v-for="activity in activities" :key="activity.title" class="activity-item">
						<div class="activity-header">
							<UIcon :name="activity.icon" class="activity-icon" />
							<span class="activity-title">{{ activity.title }}</span>
						</div>
						<p class="activity-desc">{{ activity.description }}</p>
						<div class="progress-bar">
							<div class="progress-fill" :style="{ width: activity.progress + '%' }" />
						</div>
					</div>
				</div>
			</div>
		</DraggableWindow>
	</section>
</template>

<style scoped>
.activities-section {
	padding: 60px 20px;
	min-height: 80vh;
	position: relative;
}

.activities-content {
	color: #ffb000;
	font-family: 'Courier New', monospace;
	font-size: 13px;
}

.activities-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 15px;
	margin-top: 15px;
	padding-top: 15px;
}

.activity-item {
	padding: 15px;
	background: rgba(255, 176, 0, 0.05);
	border: 1px solid rgba(255, 176, 0, 0.2);
	border-radius: 6px;
	transition: all 0.3s;
}

.activity-item:hover {
	background: rgba(255, 176, 0, 0.1);
	border-color: #ffb000;
}

.activity-header {
	display: flex;
	align-items: center;
	gap: 10px;
	margin-bottom: 8px;
}

.activity-icon {
	width: 18px;
	height: 18px;
	color: #ffb000;
}

.activity-title {
	font-weight: bold;
	font-size: 14px;
	color: #ffb000;
}

.activity-desc {
	font-size: 12px;
	color: #aaa;
	margin-bottom: 10px;
	line-height: 1.5;
}

.progress-bar {
	height: 4px;
	background: rgba(255, 176, 0, 0.2);
	border-radius: 2px;
	overflow: hidden;
}

.progress-fill {
	height: 100%;
	background: #ffb000;
	transition: width 1s ease;
}
</style>
