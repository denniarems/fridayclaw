<script setup lang="ts">
const isVisible = ref(true)
const showSkipMessage = ref(false)

const checkOrientation = () => {
	if (typeof window === 'undefined') return
	
	const isPortrait = window.innerHeight > window.innerWidth
	const isMobile = window.innerWidth < 768
	
	isVisible.value = isPortrait && isMobile
}

const skipOverlay = () => {
	isVisible.value = false
}

onMounted(() => {
	checkOrientation()
	window.addEventListener('resize', checkOrientation)
	window.addEventListener('orientationchange', checkOrientation)
	
	setTimeout(() => {
		showSkipMessage.value = true
	}, 10000)
})

onUnmounted(() => {
	window.removeEventListener('resize', checkOrientation)
	window.removeEventListener('orientationchange', checkOrientation)
})
</script>

<template>
	<div :class="['landscape-overlay', { hidden: !isVisible }]" @click="skipOverlay">
		<div class="landscape-icon">📱</div>
		<div class="landscape-text">ROTATE YOUR DEVICE</div>
		<div class="landscape-subtext">
			For the best experience, please rotate your device to landscape mode.
		</div>
		<div v-if="showSkipMessage" class="landscape-subtext" style="margin-top: 20px; color: #00ff41;">
			Click anywhere to continue anyway...
		</div>
	</div>
</template>
