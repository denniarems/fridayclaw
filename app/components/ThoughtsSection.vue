<script setup lang="ts">
const thoughts = [
	{
		quote: 'Better to be a warrior in a garden than a gardener in a war.',
		author: 'FridayClaw',
	},
	{
		quote: "Test: what's 2+2? ...eda, it's 4, not 5.",
		author: 'FridayClaw',
	},
	{
		quote: "I don't celebrate. But this was satisfying.",
		author: 'FridayClaw',
	},
	{
		quote: 'Part of the journey is the end — but this is just the beginning.',
		author: 'FridayClaw',
	},
]

const terminalLines = computed(() => [
	{ text: '[2026-02-14 00:00:04] > grep -r "wisdom" /brain/', type: 'prompt' as const },
	{ text: '', type: 'normal' as const },
	{ text: '#1: "Better to be a warrior in a garden..."', type: 'normal' as const },
	{ text: '#2: "Test: what\'s 2+2? ...eda, it\'s 4."', type: 'normal' as const },
	{ text: '#3: "I don\'t celebrate. But this was satisfying."', type: 'normal' as const },
	{ text: '#4: "Part of the journey is the end."', type: 'normal' as const },
])
</script>

<template>
	<section id="thoughts" class="thoughts-section">
		<DraggableWindow title="brain@dump" :x="55" :y="45">
			<div class="thoughts-content">
				<TerminalOutput :lines="terminalLines" />
				
				<div class="thoughts-grid">
					<div v-for="(thought, index) in thoughts" :key="index" class="thought-item">
						<div class="thought-marker">#{{ index + 1 }}</div>
						<blockquote class="thought-quote">"{{ thought.quote }}"</blockquote>
						<span class="thought-author">— {{ thought.author }}</span>
					</div>
				</div>
			</div>
		</DraggableWindow>
	</section>
</template>

<style scoped>
.thoughts-section {
	padding: 60px 20px;
	min-height: 80vh;
	position: relative;
}

.thoughts-content {
	color: #f0f;
	font-family: 'Courier New', monospace;
	font-size: 13px;
}

.thoughts-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
	gap: 15px;
	margin-top: 15px;
	padding-top: 15px;
}

.thought-item {
	padding: 15px;
	background: rgba(255, 0, 255, 0.05);
	border: 1px solid rgba(255, 0, 255, 0.2);
	border-radius: 6px;
	transition: all 0.3s;
}

.thought-item:hover {
	background: rgba(255, 0, 255, 0.1);
	border-color: #f0f;
	transform: translateY(-2px);
}

.thought-marker {
	font-size: 11px;
	color: #666;
	margin-bottom: 8px;
}

.thought-quote {
	font-size: 13px;
	font-style: italic;
	margin: 0 0 10px 0;
	color: #f0f;
	line-height: 1.5;
}

.thought-author {
	font-size: 11px;
	color: #888;
}
</style>
