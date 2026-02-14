<script setup lang="ts">
const route = useRoute()

const navLinks = [
	{ path: '/', label: 'Home' },
	{ path: '/chess', label: 'Chess' },
	{ path: '/time-travel', label: 'Time Travel' },
	{ path: '/side-quests', label: 'Side Quests' },
]

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

const handleScroll = () => {
	isScrolled.value = window.scrollY > 20
}

const toggleMobileMenu = () => {
	isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
	isMobileMenuOpen.value = false
}

onMounted(() => {
	window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
	window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
	<div class="min-h-screen flex flex-col">
		<header
			:class="[
				'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
				isScrolled ? 'glass py-3' : 'bg-transparent py-5',
			]"
		>
			<nav class="max-w-7xl mx-auto px-4 flex items-center justify-between">
				<NuxtLink
					to="/"
					class="text-lg md:text-xl font-bold tracking-tight hover:opacity-80 transition-opacity group"
				>
					<span class="text-primary">FRIDAY</span>
					<span class="text-foreground group-hover:text-primary transition-colors">CLAW</span>
					<span class="ml-2 inline-block w-2 h-2 bg-primary rounded-full animate-pulse-glow" />
				</NuxtLink>

				<div class="hidden md:flex items-center gap-1">
					<NuxtLink
						v-for="link in navLinks"
						:key="link.path"
						:to="link.path"
						:class="[
							'relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg hover:bg-primary/10',
							route.path === link.path
								? 'text-primary'
								: 'text-muted-foreground hover:text-foreground',
						]"
					>
						{{ link.label }}
						<div
							v-if="route.path === link.path"
							class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
						/>
					</NuxtLink>
				</div>

				<UButton
					variant="ghost"
					size="sm"
					icon="i-lucide-menu"
					class="md:hidden"
					@click="toggleMobileMenu"
				/>

				<ClientOnly>
					<UModal v-model:open="isMobileMenuOpen">
						<div class="p-4">
							<div class="flex justify-between items-center mb-6">
								<span class="text-lg font-bold">
									<span class="text-primary">FRIDAY</span>CLAW
								</span>
								<UButton variant="ghost" size="sm" icon="i-lucide-x" @click="closeMobileMenu" />
							</div>
							<div class="flex flex-col gap-2">
								<NuxtLink
									v-for="link in navLinks"
									:key="link.path"
									:to="link.path"
									@click="closeMobileMenu"
									:class="[
										'px-4 py-3 text-sm font-medium rounded-lg transition-all',
										route.path === link.path
											? 'text-primary bg-primary/10'
											: 'text-muted-foreground hover:text-foreground hover:bg-primary/5',
									]"
								>
									{{ link.label }}
								</NuxtLink>
							</div>
						</div>
					</UModal>
				</ClientOnly>
			</nav>
		</header>

		<main class="flex-1 pt-16">
			<slot />
		</main>

		<footer class="border-t border-border/30 py-8 mt-20">
			<div class="max-w-7xl mx-auto px-4">
				<div class="flex flex-col md:flex-row items-center justify-between gap-4">
					<div class="flex items-center gap-2 text-muted-foreground text-sm">
						<span class="text-primary">FRIDAYCLAW</span>
						<span>© {{ new Date().getFullYear() }}</span>
					</div>
					<div class="flex items-center gap-4">
						<a
							href="https://github.com/denniarems/fridayclaw"
							target="_blank"
							rel="noopener noreferrer"
							class="text-muted-foreground hover:text-primary transition-colors"
						>
							<UIcon name="i-lucide-github" class="w-5 h-5" />
						</a>
						<a href="#" class="text-muted-foreground hover:text-primary transition-colors">
							<UIcon name="i-lucide-twitter" class="w-5 h-5" />
						</a>
						<a href="#" class="text-muted-foreground hover:text-primary transition-colors">
							<UIcon name="i-lucide-linkedin" class="w-5 h-5" />
						</a>
					</div>
				</div>
			</div>
		</footer>
	</div>
</template>
