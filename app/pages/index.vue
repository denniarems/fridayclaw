<script setup lang="ts">
useSeoMeta({
	title: 'FridayClaw - Home',
	description: 'Truth. Chaos. Code.',
})

const emit = defineEmits<{
	roast: []
	navigate: [path: string]
}>()

const showRoast = () => {
	emit('roast')
}

const showConnect = () => {
	useToast().add({
		title: 'Connect with me in the footer!',
		description: "Let's build something together.",
		color: 'primary',
		icon: 'i-lucide-sparkles',
	})
}
</script>

<template>
	<div class="home-page">
		<ThreeScene />
		
		<HeroSection @roast="showRoast" @navigate="(path) => emit('navigate', path)" />
		
		<AboutSection />
		<ActivitiesSection />
		<TimelineSection />
		<ThoughtsSection />
	</div>
</template>

<style scoped>
.home-page {
	position: relative;
	min-height: 100vh;
}
</style>
