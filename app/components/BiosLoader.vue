<script setup lang="ts">
interface BootLine {
	text: string
	delay: number
	type?: 'normal' | 'success' | 'error' | 'warning'
}

const emit = defineEmits<{
	complete: []
}>()

const bootLines = ref<BootLine[]>([])
const displayedLines = ref<BootLine[]>([])
const currentIndex = ref(0)
const isComplete = ref(false)
const showPrompt = ref(false)

const bootSequence: BootLine[] = [
	{ text: 'FRIDAYCLAW BIOS v1.0.0', delay: 0, type: 'normal' },
	{ text: 'Copyright (C) 2026 Denny from Kerala', delay: 100, type: 'normal' },
	{ text: '', delay: 200, type: 'normal' },
	{ text: 'CPU: Quantum i9-9999K @ 99.9GHz', delay: 400, type: 'normal' },
	{ text: 'RAM: 666TB System OK', delay: 600, type: 'success' },
	{ text: 'GPU: Neural-GTX 9000XL', delay: 800, type: 'normal' },
	{ text: 'DISK: ∞ PB', delay: 1000, type: 'normal' },
	{ text: '', delay: 1200, type: 'normal' },
	{ text: 'Initializing personality module...', delay: 1500, type: 'normal' },
	{ text: '[OK]', delay: 1800, type: 'success' },
	{ text: 'Loading roasts from cloud...', delay: 2100, type: 'normal' },
	{ text: '[OK]', delay: 2400, type: 'success' },
	{ text: 'Calibrating sarcasm levels...', delay: 2700, type: 'normal' },
	{ text: '[OK]', delay: 3000, type: 'success' },
	{ text: 'Syncing with Denny\'s brain...', delay: 3300, type: 'normal' },
	{ text: '[FAIL]', delay: 3600, type: 'error' },
	{ text: 'Retrying...', delay: 3800, type: 'warning' },
	{ text: '[OK]', delay: 4000, type: 'success' },
	{ text: 'Installing bad jokes...', delay: 4300, type: 'normal' },
	{ text: '[ERROR]', delay: 4600, type: 'error' },
	{ text: 'Ignoring errors, proceeding...', delay: 4900, type: 'warning' },
	{ text: '[OK]', delay: 5200, type: 'success' },
	{ text: '', delay: 5500, type: 'normal' },
]

const playTypingSound = () => {
	try {
		const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
		if (audioCtx.state === 'suspended') {
			audioCtx.resume()
		}
		const oscillator = audioCtx.createOscillator()
		const gainNode = audioCtx.createGain()
		
		oscillator.connect(gainNode)
		gainNode.connect(audioCtx.destination)
		
		oscillator.frequency.value = 800
		oscillator.type = 'square'
		gainNode.gain.value = 0.02
		
		oscillator.start()
		oscillator.stop(audioCtx.currentTime + 0.03)
	} catch {
		// Audio not available
	}
}

const playBeep = () => {
	try {
		const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
		if (audioCtx.state === 'suspended') {
			audioCtx.resume()
		}
		const oscillator = audioCtx.createOscillator()
		const gainNode = audioCtx.createGain()
		
		oscillator.connect(gainNode)
		gainNode.connect(audioCtx.destination)
		
		oscillator.frequency.value = 1200
		oscillator.type = 'sine'
		gainNode.gain.value = 0.1
		
		oscillator.start()
		oscillator.stop(audioCtx.currentTime + 0.1)
	} catch {
		// Audio not available
	}
}

const playBootSound = () => {
	try {
		const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
		if (audioCtx.state === 'suspended') {
			audioCtx.resume()
		}
		
		const playTone = (freq: number, startTime: number, duration: number) => {
			const oscillator = audioCtx.createOscillator()
			const gainNode = audioCtx.createGain()
			
			oscillator.connect(gainNode)
			gainNode.connect(audioCtx.destination)
			
			oscillator.frequency.value = freq
			oscillator.type = 'sine'
			gainNode.gain.value = 0.1
			
			oscillator.start(startTime)
			oscillator.stop(startTime + duration)
		}
		
		playTone(200, 0, 0.3)
		playTone(400, 0.2, 0.2)
		playTone(600, 0.4, 0.15)
		playTone(800, 0.55, 0.1)
	} catch {
		// Audio not available
	}
}

onMounted(() => {
	playBootSound()
	
	bootSequence.forEach((line, index) => {
		setTimeout(() => {
			displayedLines.value.push(line)
			currentIndex.value = index
			playTypingSound()
			
			if (line.type === 'error') {
				setTimeout(playBeep, 100)
			}
			
			if (index === bootSequence.length - 1) {
				setTimeout(() => {
					isComplete.value = true
					showPrompt.value = true
					setTimeout(() => {
						emit('complete')
					}, 1500)
				}, 800)
			}
		}, line.delay)
	})
})

const getLineClass = (type?: string) => {
	switch (type) {
		case 'success':
			return 'terminal-success'
		case 'error':
			return 'terminal-error'
		case 'warning':
			return 'terminal-warning'
		default:
			return 'terminal-text'
	}
}
</script>

<template>
	<div class="bios-loader">
		<div class="bios-content">
			<div
				v-for="(line, index) in displayedLines"
				:key="index"
				:class="['bios-line', getLineClass(line.type)]"
			>
				{{ line.text }}
			</div>
			
			<div v-if="showPrompt" class="bios-prompt">
				<span class="terminal-success">Press any key to continue...</span>
				<span class="cursor-blink">_</span>
			</div>
		</div>
	</div>
</template>

<style scoped>
.bios-loader {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: #000;
	z-index: 99998;
	padding: 20px;
	overflow: hidden;
}

.bios-content {
	max-width: 800px;
	margin: 0 auto;
	font-family: 'Courier New', Courier, monospace;
	font-size: 14px;
	line-height: 1.8;
}

.bios-line {
	opacity: 0;
	animation: fadeIn 0.1s forwards;
}

@keyframes fadeIn {
	to {
		opacity: 1;
	}
}

.bios-prompt {
	margin-top: 20px;
	animation: blink 1s step-end infinite;
}

.cursor-blink {
	animation: cursorBlink 1s step-end infinite;
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
