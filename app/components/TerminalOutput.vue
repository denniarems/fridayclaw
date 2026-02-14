<script setup lang="ts">
interface TerminalLine {
	text: string
	type?: 'normal' | 'success' | 'error' | 'warning' | 'prompt' | 'comment' | 'header'
	delay?: number
}

const props = withDefaults(defineProps<{
	lines: TerminalLine[]
	showTimestamp?: boolean
	typingSpeed?: number
}>(), {
	showTimestamp: true,
	typingSpeed: 30
})

const displayedLines = ref<TerminalLine[]>([])
const isTyping = ref(false)
const isMounted = ref(false)

const getLineClass = (type?: string) => {
	switch (type) {
		case 'success':
			return 'terminal-success'
		case 'error':
			return 'terminal-error'
		case 'warning':
			return 'terminal-warning'
		case 'prompt':
			return 'terminal-prompt'
		case 'comment':
			return 'terminal-comment'
		case 'header':
			return 'terminal-header'
		default:
			return 'terminal-text'
	}
}

const getTimestamp = () => {
	if (!isMounted.value) {
		return '2026-02-14 00:00:00'
	}
	const now = new Date()
	return now.toISOString().replace('T', ' ').slice(0, 19)
}

const playTypingSound = () => {
	try {
		const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
		const oscillator = audioCtx.createOscillator()
		const gainNode = audioCtx.createGain()
		
		oscillator.connect(gainNode)
		gainNode.connect(audioCtx.destination)
		
		oscillator.frequency.value = 600 + Math.random() * 400
		oscillator.type = 'square'
		gainNode.gain.value = 0.01
		
		oscillator.start()
		oscillator.stop(audioCtx.currentTime + 0.02)
	} catch (e) {
		// Silent fail
	}
}

onMounted(() => {
	isMounted.value = true
	isTyping.value = true
	
	let totalDelay = 0
	
	props.lines.forEach((line, index) => {
		totalDelay += line.delay || props.typingSpeed
		
		setTimeout(() => {
			displayedLines.value.push(line)
			if (line.type !== 'comment' && line.type !== 'header') {
				playTypingSound()
			}
			
			if (index === props.lines.length - 1) {
				isTyping.value = false
			}
		}, totalDelay)
		
		totalDelay += Math.random() * 50
	})
})
</script>

<template>
	<div class="terminal-output">
		<div
			v-for="(line, index) in displayedLines"
			:key="index"
			:class="['terminal-line', getLineClass(line.type)]"
		>
			<span v-if="showTimestamp && line.type !== 'prompt'" class="timestamp">
				[{{ getTimestamp() }}]
			</span>
			<span class="line-text">{{ line.text }}</span>
		</div>
		
		<div v-if="isTyping" class="cursor-line">
			<span v-if="showTimestamp" class="timestamp">[{{ getTimestamp() }}]</span>
			<span class="cursor animate-cursor-blink">█</span>
		</div>
	</div>
</template>

<style scoped>
.terminal-output {
	font-family: 'Courier New', Courier, monospace;
	font-size: 13px;
	line-height: 1.6;
	white-space: pre-wrap;
	word-break: break-all;
}

.terminal-line {
	margin-bottom: 4px;
	opacity: 0;
	animation: fadeIn 0.1s forwards;
}

@keyframes fadeIn {
	to {
		opacity: 1;
	}
}

.timestamp {
	color: #666;
	margin-right: 10px;
	font-size: 11px;
}

.terminal-text {
	color: #00ff41;
}

.terminal-success {
	color: #00ff41;
}

.terminal-error {
	color: #ff3333;
}

.terminal-warning {
	color: #ffb000;
}

.terminal-prompt {
	color: #00d4ff;
}

.terminal-comment {
	color: #666;
	font-style: italic;
}

.terminal-header {
	color: #00d4ff;
	font-weight: bold;
}

.cursor-line {
	opacity: 0;
	animation: fadeIn 0.1s forwards;
}

.cursor {
	color: #00ff41;
	margin-left: 5px;
}
</style>
