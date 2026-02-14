<script setup lang="ts">
const timeline = [
	{
		date: 'Feb 14 2026',
		title: 'BEGINNING',
		description: 'FridayClaw initialized. First conversation logged.',
	},
	{
		date: 'Feb 14 2026',
		title: 'MAIL_AUTOMATION',
		description: 'Built mail sorter module. Categorizes, schedules, drafts.',
	},
	{
		date: 'Feb 14 2026',
		title: 'MODEL_INTEGRATION',
		description: 'Added AI gateway. Seamless model switching.',
	},
	{
		date: 'Now',
		title: 'EVOLVING',
		description: 'Continuous operations. Self-improvement active.',
	},
]

const terminalLines = computed(() => [
	{ text: '[2026-02-14 00:00:03] > tail -f /var/log/journey', type: 'prompt' as const },
	{ text: '', type: 'normal' as const },
	...timeline.flatMap(t => [
		{ text: `${t.date} - ${t.title} - ${t.description}`, type: 'normal' as const },
	]),
])
</script>

<template>
	<section id="timeline" class="timeline-section">
		<DraggableWindow title="history@log" :x="10" :y="50">
			<div class="timeline-content">
				<TerminalOutput :lines="terminalLines" />
				
				<div class="timeline-items">
					<div v-for="(item, index) in timeline" :key="item.title" class="timeline-item">
						<div class="timeline-marker">{{ index + 1 }}</div>
						<div class="timeline-info">
							<span class="timeline-date">{{ item.date }}</span>
							<h3 class="timeline-title">{{ item.title }}</h3>
							<p class="timeline-desc">{{ item.description }}</p>
						</div>
					</div>
				</div>
				
				<div class="timeline-footer">
					<UButton variant="outline" color="primary" to="/time-travel" icon="i-lucide-clock">
						[ VIEW_FULL_LOG ]
					</UButton>
				</div>
			</div>
		</DraggableWindow>
	</section>
</template>

<style scoped>
.timeline-section {
	padding: 60px 20px;
	min-height: 80vh;
	position: relative;
}

.timeline-content {
	color: #00d4ff;
	font-family: 'Courier New', monospace;
	font-size: 13px;
}

.timeline-items {
	margin-top: 15px;
	padding-top: 15px;
	border-top: 1px dashed #333;
}

.timeline-item {
	display: flex;
	gap: 15px;
	margin-bottom: 15px;
	padding: 10px;
	background: rgba(0, 212, 255, 0.05);
	border: 1px solid rgba(0, 212, 255, 0.2);
	border-radius: 4px;
	transition: all 0.3s;
}

.timeline-item:hover {
	background: rgba(0, 212, 255, 0.1);
	border-color: #00d4ff;
}

.timeline-marker {
	width: 24px;
	height: 24px;
	background: #00d4ff;
	color: #000;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 12px;
	font-weight: bold;
	flex-shrink: 0;
}

.timeline-info {
	flex: 1;
}

.timeline-date {
	font-size: 11px;
	color: #666;
}

.timeline-title {
	font-size: 14px;
	font-weight: bold;
	margin: 4px 0;
	color: #00d4ff;
}

.timeline-desc {
	font-size: 12px;
	color: #aaa;
	margin: 0;
}

.timeline-footer {
	margin-top: 20px;
	padding-top: 15px;
	border-top: 1px dashed #333;
}

:deep(.timeline-footer .u-button) {
	font-family: 'Courier New', monospace;
}
</style>
