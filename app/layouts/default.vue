<script setup lang="ts">
const route = useRoute()

const navLinks = [
	{ path: '/', label: 'home' },
	{ path: '/chess', label: 'chess' },
	{ path: '/time-travel', label: 'timeline' },
	{ path: '/side-quests', label: 'quests' },
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
	<div class="terminal-layout">
		<header
			:class="[
				'terminal-header',
				isScrolled ? 'scrolled' : '',
			]"
		>
			<nav class="terminal-nav">
				<NuxtLink to="/" class="terminal-logo">
					<span class="logo-friday">FRIDAY</span><span class="logo-claw">CLAW</span>
					<span class="logo-blink">_</span>
				</NuxtLink>

				<UButton
					variant="ghost"
					size="sm"
					icon="i-lucide-menu"
					class="terminal-menu-btn"
					@click="toggleMobileMenu"
				/>

				<ClientOnly>
					<UModal v-model:open="isMobileMenuOpen">
						<div class="terminal-modal">
							<div class="modal-header">
								<span class="terminal-logo">
									<span class="logo-friday">FRIDAY</span><span class="logo-claw">CLAW</span>
								</span>
								<UButton variant="ghost" size="sm" icon="i-lucide-x" @click="closeMobileMenu" />
							</div>
							<div class="modal-links">
								<NuxtLink
									v-for="link in navLinks"
									:key="link.path"
									:to="link.path"
									@click="closeMobileMenu"
									:class="['modal-link', route.path === link.path ? 'active' : '']"
								>
									> {{ link.label }}
								</NuxtLink>
							</div>
						</div>
					</UModal>
				</ClientOnly>
			</nav>
		</header>

		<main class="terminal-main">
			<slot />
		</main>

		<footer class="terminal-footer">
			<div class="footer-content">
				<div class="footer-left">
					<span class="terminal-prompt">user@fridayclaw:~$</span>
					<span class="footer-copyright">© {{ new Date().getFullYear() }} Denny from Kerala</span>
				</div>
				<div class="footer-links">
					<a
						href="https://github.com/denniarems/fridayclaw"
						target="_blank"
						rel="noopener noreferrer"
						class="footer-link"
					>
						[ GitHub ]
					</a>
					<a href="#" class="footer-link">
						[ Twitter ]
					</a>
					<a href="#" class="footer-link">
						[ LinkedIn ]
					</a>
				</div>
			</div>
		</footer>
	</div>
</template>

<style scoped>
.terminal-layout {
	min-height: 100vh;
	display: flex;
	flex-direction: column;
}

.terminal-header {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 100;
	background: rgba(0, 0, 0, 0.8);
	border-bottom: 1px solid #333;
	transition: all 0.3s;
	height: 45px;
}

.terminal-header.scrolled {
	background: rgba(0, 0, 0, 0.95);
	border-bottom-color: #00ff41;
}

.terminal-nav {
	max-width: 1200px;
	margin: 0 auto;
	padding: 6px 16px;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.terminal-logo {
	font-family: 'Courier New', monospace;
	font-size: 14px;
	font-weight: bold;
	text-decoration: none;
	letter-spacing: 1px;
}

.logo-friday {
	color: #00ff41;
}

.logo-claw {
	color: #00d4ff;
}

.logo-blink {
	color: #00ff41;
	animation: cursorBlink 1s step-end infinite;
}

.nav-links {
	display: flex;
	gap: 5px;
}

.nav-link {
	font-family: 'Courier New', monospace;
	font-size: 13px;
	color: #888;
	text-decoration: none;
	padding: 8px 12px;
	border-radius: 4px;
	transition: all 0.3s;
	text-transform: lowercase;
}

.nav-link:hover {
	color: #00ff41;
	background: rgba(0, 255, 65, 0.1);
}

.nav-link.active {
	color: #00ff41;
	background: rgba(0, 255, 65, 0.15);
}

.terminal-menu-btn {
	color: #00ff41 !important;
}

.terminal-menu-btn :deep(.u-button) {
	padding: 4px 8px !important;
}

.terminal-menu-btn :deep(.u-icon) {
	width: 20px !important;
	height: 20px !important;
}

.terminal-modal {
	padding: 10px;
	background: rgba(0, 0, 0, 0.95) !important;
	border: 1px solid #00ff41;
}

.modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20px;
	padding-bottom: 15px;
	border-bottom: 1px solid #333;
}

.modal-links {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.modal-link {
	font-family: 'Courier New', monospace;
	font-size: 14px;
	color: #888;
	text-decoration: none;
	padding: 12px;
	border-radius: 4px;
	transition: all 0.3s;
}

.modal-link:hover {
	color: #00ff41;
	background: rgba(0, 255, 65, 0.1);
}

.modal-link.active {
	color: #00ff41;
	background: rgba(0, 255, 65, 0.15);
}

.terminal-main {
	flex: 1;
	padding-top: 45px;
}

.terminal-footer {
	background: rgba(0, 0, 0, 0.9);
	border-top: 1px solid #333;
	padding: 20px;
}

.footer-content {
	max-width: 1200px;
	margin: 0 auto;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	align-items: center;
	gap: 15px;
}

.footer-left {
	display: flex;
	align-items: center;
	gap: 15px;
	flex-wrap: wrap;
}

.terminal-prompt {
	font-family: 'Courier New', monospace;
	font-size: 12px;
	color: #00d4ff;
}

.footer-copyright {
	font-family: 'Courier New', monospace;
	font-size: 12px;
	color: #666;
}

.footer-links {
	display: flex;
	gap: 10px;
}

.footer-link {
	font-family: 'Courier New', monospace;
	font-size: 12px;
	color: #666;
	text-decoration: none;
	transition: color 0.3s;
}

.footer-link:hover {
	color: #00ff41;
}

@keyframes cursorBlink {
	0%, 50% {
		opacity: 1;
	}
	51%, 100% {
		opacity: 0;
	}
}
</style>
