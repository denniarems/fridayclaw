<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const terminalAppRef = ref<{
	completeLoader: () => void
	triggerChaos: () => void
	navigateTo: (path: string) => void
	chaosRef: { triggerChaos: () => void } | null
} | null>(null)

onMounted(() => {
	gsap.registerPlugin(ScrollTrigger)
})

const handleRoast = () => {
	terminalAppRef.value?.triggerChaos()
}

const handleNavigate = (path: string) => {
	terminalAppRef.value?.navigateTo(path)
}

useSeoMeta({
	title: 'FridayClaw - Truth. Chaos. Code.',
	description: 'AI Assistant with attitude. Built to help, programmed to be honest.',
})
</script>

<template>
	<UApp>
		<ClientOnly>
			<TerminalApp ref="terminalAppRef">
				<NuxtLayout>
					<NuxtPage @roast="handleRoast" @navigate="handleNavigate" />
				</NuxtLayout>
			</TerminalApp>

			<template #fallback>
				<div class="app-loading">
					<div class="loading-content">
						<span class="loading-text">FRIDAYCLAW</span>
						<span class="loading-cursor">_</span>
					</div>
				</div>
			</template>
		</ClientOnly>
	</UApp>
</template>

<style scoped>
.app-loading {
	min-height: 100vh;
	background: #000;
	display: flex;
	align-items: center;
	justify-content: center;
}

.loading-content {
	font-family: 'Courier New', monospace;
	color: #00ff41;
	font-size: 24px;
	display: flex;
	align-items: center;
	gap: 2px;
}

.loading-cursor {
	animation: blink 1s step-end infinite;
}

@keyframes blink {
	0%, 50% { opacity: 1; }
	51%, 100% { opacity: 0; }
}
</style>
