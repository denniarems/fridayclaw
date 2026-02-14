<script setup lang="ts">
const isLoading = ref(true)
const isLoaderComplete = ref(false)
const chaosRef = ref<{ triggerChaos: () => void } | null>(null)
const isMounted = ref(false)

const completeLoader = () => {
	isLoading.value = false
	isLoaderComplete.value = true
}

const triggerChaos = () => {
	chaosRef.value?.triggerChaos()
}

const navigateTo = (path: string) => {
	const router = useRouter()
	router.push(path)
}

defineExpose({
	completeLoader,
	triggerChaos,
	navigateTo,
	chaosRef
})

onMounted(() => {
	isMounted.value = true
})
</script>

<template>
	<div class="terminal-app">
		<ClientOnly>
			<BiosLoader v-if="isLoading" @complete="completeLoader" />
			
			<template v-if="isLoaderComplete">
				<LandscapeOverlay />
				<CrtEffects />
				<CodeRain />
				<ChaosMode ref="chaosRef" />
				
				<slot />
			</template>

			<template #fallback>
				<div class="terminal-loading">
					<div class="loading-cursor">_</div>
				</div>
			</template>
		</ClientOnly>
	</div>
</template>

<style scoped>
.terminal-app {
	min-height: 100vh;
	background: #030712;
}

.terminal-loading {
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #000;
	color: #00ff41;
	font-family: 'Courier New', monospace;
	font-size: 14px;
}

.loading-cursor {
	animation: blink 1s step-end infinite;
}

@keyframes blink {
	0%, 50% { opacity: 1; }
	51%, 100% { opacity: 0; }
}
</style>
