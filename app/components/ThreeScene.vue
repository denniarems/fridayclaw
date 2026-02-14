<script setup lang="ts">
const containerRef = ref<HTMLElement | null>(null)
const mouseX = ref(0)
const mouseY = ref(0)
const isMounted = ref(false)

const cubePositions = ref<Array<{
	delay: string
	distanceX: string
	distanceY: string
	depth: string
	color: string
}>>([
	{ delay: '0.5s', distanceX: '50px', distanceY: '-80px', depth: '1px', color: '#00ff41' },
	{ delay: '1s', distanceX: '-120px', distanceY: '40px', depth: '-0.5px', color: '#00d4ff' },
	{ delay: '1.5s', distanceX: '80px', distanceY: '100px', depth: '0.5px', color: '#00ff41' },
	{ delay: '2s', distanceX: '-60px', distanceY: '-60px', depth: '1.5px', color: '#00d4ff' },
	{ delay: '2.5s', distanceX: '140px', distanceY: '-20px', depth: '-1px', color: '#00ff41' },
	{ delay: '3s', distanceX: '-100px', distanceY: '80px', depth: '0px', color: '#00d4ff' },
	{ delay: '3.5s', distanceX: '30px', distanceY: '120px', depth: '-1.5px', color: '#00ff41' },
	{ delay: '4s', distanceX: '-80px', distanceY: '-100px', depth: '0.5px', color: '#00d4ff' },
])

const onMouseMove = (e: MouseEvent) => {
	if (typeof window === 'undefined') return
	mouseX.value = (e.clientX / window.innerWidth - 0.5) * 20
	mouseY.value = (e.clientY / window.innerHeight - 0.5) * 20
}

const initCubePositions = () => {
	if (typeof window === 'undefined') return
	cubePositions.value = Array.from({ length: 8 }, (_, i) => ({
		delay: (i * 0.5) + 's',
		distanceX: (Math.random() - 0.5) * 300 + 'px',
		distanceY: (Math.random() - 0.5) * 300 + 'px',
		depth: (Math.random() * 2 - 1) * 2 + 'px',
		color: i % 2 === 0 ? '#00ff41' : '#00d4ff'
	}))
}

onMounted(() => {
	isMounted.value = true
	initCubePositions()
	window.addEventListener('mousemove', onMouseMove)
})

onUnmounted(() => {
	window.removeEventListener('mousemove', onMouseMove)
})
</script>

<template>
	<div ref="containerRef" class="three-scene" :style="{ '--mouse-x': mouseX + 'px', '--mouse-y': mouseY + 'px' }">
		<div class="scene-container">
			<div class="terminal-3d">
				<div class="terminal-body">
					<div class="terminal-screen">
						<div class="screen-content">
							<span class="prompt">user@fridayclaw:~$</span>
							<span class="cursor">_</span>
						</div>
					</div>
				</div>
				<div class="terminal-stand" />
				<div class="terminal-base" />
			</div>
			
			<div 
				v-for="(pos, i) in cubePositions" 
				:key="i" 
				class="floating-cube"
				:style="pos"
			>
				<div class="cube-face front" />
				<div class="cube-face back" />
				<div class="cube-face left" />
				<div class="cube-face right" />
				<div class="cube-face top" />
				<div class="cube-face bottom" />
			</div>
			
			<div class="particle-field">
				<div v-for="i in 30" :key="i" class="particle" :style="{ '--i': i }" />
			</div>
		</div>
	</div>
</template>

<style scoped>
.three-scene {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	pointer-events: none;
	z-index: 1;
	perspective: 1000px;
	overflow: hidden;
}

.scene-container {
	position: absolute;
	width: 100%;
	height: 100%;
	transform-style: preserve-3d;
	transform: rotateX(5deg) rotateY(var(--mouse-x, 0)) rotateX(var(--mouse-y, 0));
	transition: transform 0.1s ease-out;
}

.terminal-3d {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%) translateZ(50px);
	transform-style: preserve-3d;
	animation: float 4s ease-in-out infinite;
}

@keyframes float {
	0%, 100% { transform: translate(-50%, -50%) translateZ(50px) translateY(0); }
	50% { transform: translate(-50%, -50%) translateZ(50px) translateY(-20px); }
}

.terminal-body {
	width: 200px;
	height: 140px;
	background: linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%);
	border: 2px solid #00ff41;
	border-radius: 8px;
	padding: 8px;
	box-shadow: 
		0 0 20px rgba(0, 255, 65, 0.3),
		inset 0 0 30px rgba(0, 255, 65, 0.05);
}

.terminal-screen {
	width: 100%;
	height: 100%;
	background: #000;
	border-radius: 4px;
	padding: 10px;
	display: flex;
	align-items: center;
}

.screen-content {
	font-family: 'Courier New', monospace;
	font-size: 14px;
	color: #00ff41;
}

.prompt {
	margin-right: 5px;
}

.cursor {
	animation: blink 1s step-end infinite;
}

@keyframes blink {
	0%, 50% { opacity: 1; }
	51%, 100% { opacity: 0; }
}

.terminal-stand {
	width: 80px;
	height: 20px;
	background: linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%);
	margin: 0 auto;
	border-left: 2px solid #00ff41;
	border-right: 2px solid #00ff41;
}

.terminal-base {
	width: 120px;
	height: 10px;
	background: #1a1a1a;
	margin: 0 auto;
	border: 2px solid #00ff41;
	border-radius: 4px;
}

.floating-cube {
	position: absolute;
	top: 50%;
	left: 50%;
	width: 20px;
	height: 20px;
	transform-style: preserve-3d;
	animation: orbit 8s linear infinite;
	animation-delay: var(--delay);
}

@keyframes orbit {
	0% {
		transform: translate(-50%, -50%) translateZ(0) rotateX(0deg) rotateY(0deg);
	}
	100% {
		transform: translate(-50%, -50%) translateZ(0) rotateX(360deg) rotateY(360deg);
	}
}

.cube-face {
	position: absolute;
	width: 20px;
	height: 20px;
	border: 1px solid var(--color);
	background: rgba(0, 0, 0, 0.5);
	box-shadow: 0 0 10px var(--color);
}

.front { transform: translateZ(10px); }
.back { transform: translateZ(-10px); }
.left { transform: translateX(-10px) rotateY(90deg); }
.right { transform: translateX(10px) rotateY(90deg); }
.top { transform: translateY(-10px) rotateX(90deg); }
.bottom { transform: translateY(10px) rotateX(90deg); }

.particle-field {
	position: absolute;
	width: 100%;
	height: 100%;
	transform-style: preserve-3d;
}

.particle {
	position: absolute;
	width: 2px;
	height: 2px;
	background: #00ff41;
	border-radius: 50%;
	left: calc(10% + var(--i) * 3%);
	top: calc(10% + var(--i) * 2%);
	opacity: 0.6;
	animation: twinkle 2s ease-in-out infinite;
	animation-delay: calc(var(--i) * 0.1s);
}

@keyframes twinkle {
	0%, 100% { opacity: 0.2; transform: scale(1); }
	50% { opacity: 1; transform: scale(1.5); }
}
</style>
