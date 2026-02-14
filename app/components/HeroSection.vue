<script setup lang="ts">
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

const terminalLines = [
	{ text: 'user@fridayclaw:~$ ./init.sh', type: 'prompt' as const },
	{ text: '', type: 'normal' as const, delay: 200 },
	{ text: '> Truth. Chaos. Code.', type: 'normal' as const, delay: 300 },
	{ text: '> System ready.', type: 'success' as const, delay: 400 },
	{ text: '', type: 'normal' as const, delay: 500 },
	{ text: 'user@fridayclaw:~$ _', type: 'prompt' as const, delay: 600 },
]

const commandOutput = ref<string[]>([])
const isTypingComplete = ref(false)

const handleCommand = (cmd: string) => {
	const command = cmd.toLowerCase().trim()
	
	switch (command) {
		case 'help':
			commandOutput.value = [
				'Available commands:',
				'  help              - Show this message',
				'  goto about        - Scroll to About',
				'  goto activities   - Scroll to Activities',
				'  goto timeline    - Scroll to Timeline',
				'  goto thoughts    - Scroll to Thoughts',
				'  chess, play       - Open Chess page',
				'  roast             - Trigger chaos mode',
				'  whoami            - Show Denny\'s bio',
				'  skills            - List tech stack',
				'  clear             - Clear terminal',
			]
			break
		case 'goto about':
			document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
			commandOutput.value = ['> Navigating to About section...']
			break
		case 'goto activities':
			document.getElementById('activities')?.scrollIntoView({ behavior: 'smooth' })
			commandOutput.value = ['> Navigating to Activities section...']
			break
		case 'goto timeline':
			document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' })
			commandOutput.value = ['> Navigating to Timeline section...']
			break
		case 'goto thoughts':
			document.getElementById('thoughts')?.scrollIntoView({ behavior: 'smooth' })
			commandOutput.value = ['> Navigating to Thoughts section...']
			break
		case 'chess':
		case 'play':
			emit('navigate', '/chess')
			commandOutput.value = ['> Opening CHESS.EXE...']
			break
		case 'roast':
			emit('roast')
			commandOutput.value = ['> Initiating ROAST_ME.EXE...']
			break
		case 'whoami':
			commandOutput.value = [
				'Denny',
				'Location: Kerala, India',
				'Role: Developer, Creator, Dreamer',
				'Status: Building cool stuff',
			]
			break
		case 'skills':
			commandOutput.value = [
				'TypeScript',
				'Vue',
				'React',
				'Node.js',
				'Solidity',
				'Python',
			]
			break
		case 'clear':
			commandOutput.value = []
			break
		default:
			commandOutput.value = [`bash: ${command}: command not found`]
	}
}

onMounted(() => {
	setTimeout(() => {
		isTypingComplete.value = true
	}, 1500)
})
</script>

<template>
	<section class="hero-section">
		<div class="hero-terminal">
			<div class="terminal-header">
				<div class="terminal-buttons">
					<span class="btn close"></span>
					<span class="btn minimize"></span>
					<span class="btn maximize"></span>
				</div>
				<span class="terminal-title">user@fridayclaw: ~</span>
			</div>
			
			<div class="terminal-body">
				<TerminalOutput :lines="terminalLines" :show-timestamp="false" />
				
				<div v-if="commandOutput.length > 0" class="command-output">
					<div v-for="(line, i) in commandOutput" :key="i" class="output-line">
						{{ line }}
					</div>
				</div>
				
				<div v-if="isTypingComplete" class="terminal-input-area">
					<TerminalInput @command="handleCommand" />
				</div>
			</div>
		</div>
		
		<div class="hero-buttons">
			<button class="terminal-button" @click="showRoast">
				<span class="btn-label">[ ROAST_ME.EXE ]</span>
			</button>
			
			<button class="terminal-button connect" @click="showConnect">
				<span class="btn-label">[ CONNECT.NET ]</span>
			</button>
			
			<NuxtLink to="/chess" class="terminal-button chess">
				<span class="btn-label">[ CHESS.EXE ]</span>
			</NuxtLink>
		</div>
		
		<div class="hero-footer">
			<div class="hero-stats">
				<span>FAST</span>
				<span>CLEAN</span>
				<span>SMART</span>
			</div>
		</div>
	</section>
</template>

<style scoped>
.hero-section {
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 40px 20px;
	position: relative;
	z-index: 10;
}

.hero-terminal {
	width: 100%;
	max-width: 600px;
	background: rgba(0, 0, 0, 0.95);
	border: 1px solid #00ff41;
	border-radius: 8px;
	box-shadow: 
		0 0 20px rgba(0, 255, 65, 0.2),
		inset 0 0 50px rgba(0, 255, 65, 0.03);
	overflow: hidden;
}

.terminal-header {
	background: linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%);
	padding: 10px 15px;
	display: flex;
	align-items: center;
	gap: 15px;
	border-bottom: 1px solid #333;
}

.terminal-buttons {
	display: flex;
	gap: 8px;
}

.btn {
	width: 12px;
	height: 12px;
	border-radius: 50%;
	cursor: pointer;
}

.btn.close {
	background: #ff5f57;
}

.btn.minimize {
	background: #febc2e;
}

.btn.maximize {
	background: #28c840;
}

.terminal-title {
	color: #00ff41;
	font-family: 'Courier New', monospace;
	font-size: 13px;
}

.terminal-body {
	padding: 20px;
	min-height: 300px;
}

.command-output {
	margin-top: 10px;
	padding-top: 10px;
	border-top: 1px dashed #333;
}

.output-line {
	color: #00ff41;
	font-family: 'Courier New', monospace;
	font-size: 13px;
	margin-bottom: 4px;
}

.terminal-input-area {
	margin-top: 15px;
}

.hero-buttons {
	display: flex;
	flex-wrap: wrap;
	gap: 15px;
	margin-top: 30px;
	justify-content: center;
}

.terminal-button {
	background: transparent;
	border: 1px solid #00d4ff;
	color: #00d4ff;
	padding: 12px 24px;
	font-family: 'Courier New', monospace;
	font-size: 14px;
	cursor: pointer;
	transition: all 0.3s ease;
	border-radius: 4px;
	text-decoration: none;
}

.terminal-button:hover {
	background: rgba(0, 212, 255, 0.1);
	box-shadow: 0 0 15px rgba(0, 212, 255, 0.3);
}

.terminal-button.connect {
	border-color: #00ff41;
	color: #00ff41;
}

.terminal-button.connect:hover {
	background: rgba(0, 255, 65, 0.1);
	box-shadow: 0 0 15px rgba(0, 255, 65, 0.3);
}

.terminal-button.chess {
	border-color: #ffb000;
	color: #ffb000;
}

.terminal-button.chess:hover {
	background: rgba(255, 176, 0, 0.1);
	box-shadow: 0 0 15px rgba(255, 176, 0, 0.3);
}

.btn-label {
	letter-spacing: 2px;
}

.hero-footer {
	position: absolute;
	bottom: 40px;
}

.hero-stats {
	display: flex;
	gap: 30px;
	color: #666;
	font-family: 'Courier New', monospace;
	font-size: 12px;
	letter-spacing: 3px;
}

.hero-stats span {
	transition: color 0.3s;
}

.hero-stats span:hover {
	color: #00ff41;
}
</style>
