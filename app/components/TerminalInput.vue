<script setup lang="ts">
const emit = defineEmits<{
	command: [cmd: string]
}>()

const inputValue = ref('')
const inputRef = ref<HTMLInputElement | null>(null)
const history = ref<string[]>([])
const historyIndex = ref(-1)
const suggestions = ref<string[]>([])
const showSuggestions = ref(false)

const commands = [
	{ cmd: 'help', desc: 'Show available commands' },
	{ cmd: 'goto about', desc: 'Scroll to About section' },
	{ cmd: 'goto activities', desc: 'Scroll to Activities section' },
	{ cmd: 'goto timeline', desc: 'Scroll to Timeline section' },
	{ cmd: 'goto thoughts', desc: 'Scroll to Thoughts section' },
	{ cmd: 'chess', desc: 'Play chess' },
	{ cmd: 'play', desc: 'Play chess' },
	{ cmd: 'roast', desc: 'Trigger chaos mode' },
	{ cmd: 'whoami', desc: 'Show Denny\'s bio' },
	{ cmd: 'skills', desc: 'List tech stack' },
	{ cmd: 'clear', desc: 'Clear terminal' },
]

const playKeySound = () => {
	try {
		const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
		const oscillator = audioCtx.createOscillator()
		const gainNode = audioCtx.createGain()
		
		oscillator.connect(gainNode)
		gainNode.connect(audioCtx.destination)
		
		oscillator.frequency.value = 1000 + Math.random() * 500
		oscillator.type = 'square'
		gainNode.gain.value = 0.02
		
		oscillator.start()
		oscillator.stop(audioCtx.currentTime + 0.015)
	} catch (e) {
		// Silent fail
	}
}

const playEnterSound = () => {
	try {
		const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
		const oscillator = audioCtx.createOscillator()
		const gainNode = audioCtx.createGain()
		
		oscillator.connect(gainNode)
		gainNode.connect(audioCtx.destination)
		
		oscillator.frequency.value = 600
		oscillator.type = 'sine'
		gainNode.gain.value = 0.05
		
		oscillator.start()
		oscillator.stop(audioCtx.currentTime + 0.08)
	} catch (e) {
		// Silent fail
	}
}

const updateSuggestions = () => {
	if (!inputValue.value) {
		suggestions.value = []
		showSuggestions.value = false
		return
	}
	
	const search = inputValue.value.toLowerCase()
	const matches = commands
		.filter(c => c.cmd.toLowerCase().startsWith(search))
		.map(c => c.cmd)
	
	suggestions.value = matches.slice(0, 5)
	showSuggestions.value = matches.length > 0
}

const handleInput = () => {
	updateSuggestions()
	playKeySound()
}

const handleKeydown = (e: KeyboardEvent) => {
	if (e.key === 'Enter') {
		submitCommand()
	} else if (e.key === 'ArrowUp') {
		e.preventDefault()
		if (historyIndex.value < history.value.length - 1) {
			historyIndex.value++
			inputValue.value = history.value[history.value.length - 1 - historyIndex.value] || ''
		}
	} else if (e.key === 'ArrowDown') {
		e.preventDefault()
		if (historyIndex.value > 0) {
			historyIndex.value--
			inputValue.value = history.value[history.value.length - 1 - historyIndex.value] || ''
		} else {
			historyIndex.value = -1
			inputValue.value = ''
		}
	} else if (e.key === 'Tab' && suggestions.value.length > 0) {
		e.preventDefault()
		inputValue.value = suggestions.value[0] ?? ''
		showSuggestions.value = false
	} else if (e.key === 'Escape') {
		showSuggestions.value = false
	}
}

const submitCommand = () => {
	const cmd = inputValue.value.trim()
	if (!cmd) return
	
	playEnterSound()
	history.value.push(cmd)
	historyIndex.value = -1
	showSuggestions.value = false
	
	emit('command', cmd)
	inputValue.value = ''
}

onMounted(() => {
	inputRef.value?.focus()
})
</script>

<template>
	<div class="terminal-input-container">
		<div class="terminal-input-wrapper">
			<span class="prompt">user@fridayclaw:~$</span>
			<input
				ref="inputRef"
				v-model="inputValue"
				type="text"
				class="terminal-input"
				autocomplete="off"
				spellcheck="false"
				@input="handleInput"
				@keydown="handleKeydown"
			/>
		</div>
		
		<div v-if="showSuggestions" class="suggestions">
			<div
				v-for="suggestion in suggestions"
				:key="suggestion"
				class="suggestion"
				@click="inputValue = suggestion; showSuggestions = false; submitCommand()"
			>
				{{ suggestion }}
			</div>
		</div>
	</div>
</template>

<style scoped>
.terminal-input-container {
	position: relative;
	width: 100%;
}

.terminal-input-wrapper {
	display: flex;
	align-items: center;
	gap: 8px;
	font-family: 'Courier New', Courier, monospace;
	font-size: 14px;
}

.prompt {
	color: #00d4ff;
	flex-shrink: 0;
}

.terminal-input {
	flex: 1;
	background: transparent;
	border: none;
	outline: none;
	color: #00ff41;
	font-family: inherit;
	font-size: inherit;
	caret-color: #00ff41;
}

.terminal-input::placeholder {
	color: #333;
}

.suggestions {
	position: absolute;
	top: 100%;
	left: 0;
	right: 0;
	background: rgba(0, 0, 0, 0.95);
	border: 1px solid #00ff41;
	border-radius: 4px;
	margin-top: 4px;
	overflow: hidden;
	z-index: 100;
}

.suggestion {
	padding: 8px 12px;
	color: #00ff41;
	cursor: pointer;
	transition: background 0.2s;
}

.suggestion:hover {
	background: rgba(0, 255, 65, 0.1);
}
</style>
