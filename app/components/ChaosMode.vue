<script setup lang="ts">
const emit = defineEmits<{
	complete: []
}>()

const isActive = ref(false)
const showReboot = ref(false)
const showSystemFailure = ref(false)
const bodyRef = ref<HTMLElement | null>(null)

const playGlitchSound = () => {
	const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
	
	const createGlitch = () => {
		const oscillator = audioCtx.createOscillator()
		const gainNode = audioCtx.createGain()
		
		oscillator.connect(gainNode)
		gainNode.connect(audioCtx.destination)
		
		oscillator.frequency.value = Math.random() * 2000 + 100
		oscillator.type = 'sawtooth'
		gainNode.gain.value = 0.1
		
		oscillator.start()
		oscillator.stop(audioCtx.currentTime + 0.05)
	}
	
	for (let i = 0; i < 5; i++) {
		setTimeout(createGlitch, i * 50)
	}
}

const playErrorBeep = () => {
	const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
	const oscillator = audioCtx.createOscillator()
	const gainNode = audioCtx.createGain()
	
	oscillator.connect(gainNode)
	gainNode.connect(audioCtx.destination)
	
	oscillator.frequency.value = 150
	oscillator.type = 'square'
	gainNode.gain.value = 0.2
	
	oscillator.start()
	oscillator.stop(audioCtx.currentTime + 0.5)
}

const playBootSound = () => {
	const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
	
	const playTone = (freq: number, startTime: number, duration: number) => {
		const oscillator = audioCtx.createOscillator()
		const gainNode = audioCtx.createGain()
		
		oscillator.connect(gainNode)
		gainNode.connect(audioCtx.destination)
		
		oscillator.frequency.value = freq
		oscillator.type = 'sine'
		gainNode.gain.value = 0.15
		
		oscillator.start(startTime)
		oscillator.stop(startTime + duration)
	}
	
	playTone(200, 0, 0.3)
	playTone(400, 0.2, 0.2)
	playTone(600, 0.4, 0.15)
	playTone(800, 0.55, 0.1)
}

const triggerChaos = () => {
	if (isActive.value) return
	
	isActive.value = true
	showSystemFailure.value = false
	showReboot.value = false
	
	const chaosDuration = Math.random() * 4000 + 3000
	
	playGlitchSound()
	playErrorBeep()
	
	setTimeout(() => {
		showSystemFailure.value = true
		playErrorBeep()
	}, chaosDuration * 0.3)
	
	setTimeout(() => {
		showSystemFailure.value = false
		showReboot.value = true
		playBootSound()
	}, chaosDuration * 0.6)
	
	setTimeout(() => {
		isActive.value = false
		showReboot.value = false
		emit('complete')
	}, chaosDuration)
}

defineExpose({ triggerChaos })
</script>

<template>
	<Teleport to="body">
		<div v-if="isActive" class="chaos-container">
			<div :class="['chaos-overlay', { active: isActive }]" />
			<div :class="['chaos-rgb-split', { active: isActive }]" />
			
			<div v-if="showSystemFailure" class="chaos-failure">
				<div class="failure-text">SYSTEM_FAILURE</div>
				<div class="failure-code">
					ERROR: 0x{{ Math.random().toString(16).slice(2, 10) }}
				</div>
			</div>
			
			<div v-if="showReboot" class="chaos-reboot">
				<div class="reboot-text">SYSTEM REBOOT</div>
				<div class="reboot-bar">
					<div class="reboot-progress" />
					</div>
			</div>
		</div>
	</Teleport>
</template>

<style scoped>
.chaos-container {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 10000;
	pointer-events: none;
}

.chaos-overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: repeating-linear-gradient(
		0deg,
		transparent,
		transparent 2px,
		rgba(0, 0, 0, 0.3) 2px,
		rgba(0, 0, 0, 0.3) 4px
	);
	animation: glitch 0.1s infinite;
}

.chaos-overlay.active {
	opacity: 0.6;
}

.chaos-rgb-split {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: 
		red -10px 0 / 100% 100% repeat-y,
		blue 10px 0 / 100% 100% repeat-y;
	mix-blend-mode: screen;
	animation: rgbShift 0.05s infinite;
}

.chaos-rgb-split.active {
	opacity: 0.5;
}

@keyframes glitch {
	0% {
		transform: translate(0);
	}
	20% {
		transform: translate(-5px, 5px);
	}
	40% {
		transform: translate(-5px, -5px);
	}
	60% {
		transform: translate(5px, 5px);
	}
	80% {
		transform: translate(5px, -5px);
	}
	100% {
		transform: translate(0);
	}
}

@keyframes rgbShift {
	0% {
		background-position: -10px 0, 10px 0;
	}
	100% {
		background-position: 10px 0, -10px 0;
	}
}

.chaos-failure {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	text-align: center;
	animation: failureGlitch 0.2s infinite;
}

.failure-text {
	font-family: 'Courier New', monospace;
	font-size: 48px;
	font-weight: bold;
	color: #ff0000;
	text-shadow: 
		0 0 10px #ff0000,
		0 0 20px #ff0000,
		-2px 0 #00ff00,
		2px 0 #0000ff;
	animation: textFlicker 0.1s infinite;
}

.failure-code {
	font-family: 'Courier New', monospace;
	font-size: 14px;
	color: #ff0000;
	margin-top: 10px;
}

@keyframes textFlicker {
	0%, 100% {
		opacity: 1;
	}
	50% {
		opacity: 0.5;
	}
}

@keyframes failureGlitch {
	0% {
		transform: translate(-50%, -50%) skew(0deg);
	}
	25% {
		transform: translate(-48%, -52%) skew(2deg);
	}
	50% {
		transform: translate(-52%, -48%) skew(-2deg);
	}
	75% {
		transform: translate(-49%, -51%) skew(1deg);
	}
	100% {
		transform: translate(-50%, -50%) skew(0deg);
	}
}

.chaos-reboot {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	text-align: center;
	width: 300px;
}

.reboot-text {
	font-family: 'Courier New', monospace;
	font-size: 24px;
	color: #00ff41;
	margin-bottom: 20px;
	animation: bootPulse 0.5s ease-in-out infinite;
}

.reboot-bar {
	width: 100%;
	height: 20px;
	background: #111;
	border: 1px solid #00ff41;
	border-radius: 2px;
	overflow: hidden;
}

.reboot-progress {
	height: 100%;
	background: #00ff41;
	animation: bootProgress 2s linear forwards;
	box-shadow: 0 0 10px #00ff41;
}

@keyframes bootPulse {
	0%, 100% {
		opacity: 1;
	}
	50% {
		opacity: 0.5;
	}
}

@keyframes bootProgress {
	0% {
		width: 0%;
	}
	100% {
		width: 100%;
	}
}
</style>
