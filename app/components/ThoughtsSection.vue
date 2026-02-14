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
</script>

<template>
	<section class="py-24 px-4 bg-card/30">
		<div class="max-w-4xl mx-auto">
			<h2 class="text-3xl md:text-4xl font-bold mb-12 text-center">
				<span class="gradient-text">Thoughts</span>
			</h2>

			<div class="grid md:grid-cols-2 gap-6">
				<div
					v-for="(thought, index) in thoughts"
					:key="index"
					class="glass rounded-xl p-6 hover:border-secondary/50 transition-all"
				>
					<UIcon name="i-lucide-message-square-quote" class="w-8 h-8 text-secondary/50 mb-4" />
					<p class="text-lg mb-4 italic">"{{ thought.quote }}"</p>
					<span class="text-sm text-muted-foreground">— {{ thought.author }}</span>
				</div>
			</div>
		</div>
	</section>
</template>
