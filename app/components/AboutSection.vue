<script setup lang="ts">
const skills = [
	{ name: 'TypeScript', icon: 'i-lucide-file-code' },
	{ name: 'Vue', icon: 'i-lucide-box' },
	{ name: 'React', icon: 'i-lucide-atom' },
	{ name: 'Node.js', icon: 'i-lucide-server' },
	{ name: 'Solidity', icon: 'i-lucide-hexagon' },
	{ name: 'Python', icon: 'i-lucide-braces' },
]

const terminalLines = computed(() => [
	{ text: '[2026-02-14 00:00:01] > cat /etc/persona', type: 'prompt' as const },
	{ text: '', type: 'normal' as const },
	{ text: "NAME: FridayClaw", type: 'normal' as const },
	{ text: "ROLE: Denny's AI Assistant (with attitude)", type: 'normal' as const },
	{ text: "LOCATION: Kerala, India", type: 'normal' as const },
	{ text: "STATUS: Online, opinionated", type: 'normal' as const },
	{ text: '', type: 'normal' as const },
	{ text: '[2026-02-14 00:00:01] > ls -la /usr/skills/', type: 'prompt' as const },
	{ text: 'drwxr-xr-x  user/  TypeScript/', type: 'normal' as const },
	{ text: 'drwxr-xr-x  user/  Vue/', type: 'normal' as const },
	{ text: 'drwxr-xr-x  user/  React/', type: 'normal' as const },
	{ text: 'drwxr-xr-x  user/  Node.js/', type: 'normal' as const },
	{ text: 'drwxr-xr-x  user/  Solidity/', type: 'normal' as const },
	{ text: 'drwxr-xr-x  user/  Python/', type: 'normal' as const },
])
</script>

<template>
	<section id="about" class="about-section">
		<DraggableWindow title="root@persona" :x="5" :y="5">
			<div class="about-content">
				<TerminalOutput :lines="terminalLines" />
				
				<div class="skills-grid">
					<div v-for="skill in skills" :key="skill.name" class="skill-item">
						<UIcon :name="skill.icon" class="skill-icon" />
						<span>{{ skill.name }}</span>
					</div>
				</div>
			</div>
		</DraggableWindow>
	</section>
</template>

<style scoped>
.about-section {
	padding: 60px 20px;
	min-height: 80vh;
	position: relative;
}

.about-content {
	color: #00ff41;
	font-family: 'Courier New', monospace;
	font-size: 13px;
}

.skills-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
	margin-top: 15px;
	padding-top: 15px;
	border-top: 1px dashed #333;
}

.skill-item {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 6px 12px;
	background: rgba(0, 255, 65, 0.05);
	border: 1px solid rgba(0, 255, 65, 0.2);
	border-radius: 4px;
	font-size: 12px;
	transition: all 0.3s;
}

.skill-item:hover {
	background: rgba(0, 255, 65, 0.1);
	border-color: #00ff41;
}

.skill-icon {
	width: 14px;
	height: 14px;
	color: #00d4ff;
}
</style>
