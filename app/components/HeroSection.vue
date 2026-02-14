<script setup lang="ts">
const roasts = [
	'Eda mone, your code looks like spaghetti thrown at a wall. Fix it.',
	'You call that a commit message? My grandma writes better logs.',
	'Deploying on Friday? Brave. Stupid, but brave.',
	'Idea mathram undenkil mathi illa. Execute cheyy.',
	'Why are you looking at me? Go write some tests.',
	'Scene illa, but logic illa either.',
]

const showRoast = () => {
	const randomRoast = roasts[Math.floor(Math.random() * roasts.length)]
	useToast().add({
		title: randomRoast,
		description: "Truth hurts, doesn't it?",
		color: 'primary',
		icon: 'i-lucide-flame',
	})
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
	<section
		class="min-h-screen flex flex-col justify-center items-center text-center px-4 py-20 relative overflow-hidden"
	>
		<div
			class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--color-primary)_0%,transparent_50%)] opacity-10"
		/>

		<div
			class="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]"
		/>

		<div class="relative z-10 w-full max-w-2xl">
			<div class="flex justify-center mb-8">
				<div class="relative">
					<div
						class="w-20 h-20 md:w-24 md:h-24 rounded-2xl gradient-bg flex items-center justify-center animate-float"
					>
						<UIcon name="i-lucide-terminal" class="w-10 h-10 md:w-12 md:h-12 text-white" />
					</div>
					<div
						class="absolute -right-2 -top-2 w-4 h-4 bg-primary rounded-full animate-pulse-glow"
					/>
				</div>
			</div>

			<h1 class="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
				<span class="block text-muted-foreground">Truth. Chaos.</span>
				<span class="gradient-text">Code.</span>
			</h1>

			<p class="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto mb-8 leading-relaxed">
				I'm not here to be nice. I'm here to be right.
				<span class="block mt-2 text-sm opacity-60">(and occasionally roast you)</span>
			</p>

			<div class="flex justify-center gap-4 mb-12 flex-wrap">
				<UButton
					variant="outline"
					size="lg"
					color="primary"
					icon="i-lucide-flame"
					@click="showRoast"
				>
					Reality Check
				</UButton>

				<UButton size="lg" color="primary" icon="i-lucide-sparkles" @click="showConnect">
					Connect
				</UButton>

				<UButton variant="ghost" size="lg" color="neutral" icon="i-lucide-chess-knight" to="/chess">
					Play Chess
				</UButton>
			</div>

			<div class="flex justify-center gap-8 text-sm text-muted-foreground">
				<div class="flex items-center gap-2">
					<UIcon name="i-lucide-zap" class="w-4 h-4 text-primary" />
					<span class="font-mono">Fast</span>
				</div>
				<div class="flex items-center gap-2">
					<UIcon name="i-lucide-code-2" class="w-4 h-4 text-secondary" />
					<span class="font-mono">Clean</span>
				</div>
				<div class="flex items-center gap-2">
					<UIcon name="i-lucide-cpu" class="w-4 h-4 text-accent" />
					<span class="font-mono">Smart</span>
				</div>
			</div>
		</div>

		<div
			class="absolute bottom-8 text-muted-foreground text-sm flex flex-col items-center gap-2 animate-bounce"
		>
			<span>Scroll down if you dare</span>
			<UIcon name="i-lucide-chevron-down" class="w-5 h-5" />
		</div>
	</section>
</template>
