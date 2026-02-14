<script setup lang="ts">
const props = withDefaults(defineProps<{
	color?: string
	opacity?: number
	active?: boolean
}>(), {
	color: '#00ff41',
	opacity: 0.15,
	active: true
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationId: number | null = null
let ctx: CanvasRenderingContext2D | null = null

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*(){}[]|;:,.<>?/\\`'
const fontSize = 14
let columns = 0
let drops: number[] = []

const resize = () => {
	if (!canvasRef.value) return
	
	canvasRef.value.width = window.innerWidth
	canvasRef.value.height = window.innerHeight
	
	columns = Math.floor((canvasRef.value.width || 0) / fontSize)
	drops = Array(columns).fill(1)
}

const draw = () => {
	if (!ctx || !canvasRef.value || !props.active) return
	
	ctx.fillStyle = `rgba(0, 0, 0, ${props.opacity})`
	ctx.fillRect(0, 0, canvasRef.value.width || 0, canvasRef.value.height || 0)
	
	ctx.font = `${fontSize}px Courier New`
	ctx.fillStyle = `rgba(0, 255, 65, ${Math.random() * 0.5 + 0.5})`
	
	for (let i = 0; i < drops.length; i++) {
		const char = chars[Math.floor(Math.random() * chars.length)] || '?'
		const x = i * fontSize
		const y = (drops[i] || 1) * fontSize
		
		ctx.fillStyle = `rgba(0, 255, 65, ${Math.random() * 0.5 + 0.5})`
		ctx.fillText(char, x, y)
		
		if (y > (canvasRef.value.height || 0) && Math.random() > 0.975) {
			drops[i] = 0
		}
		
		drops[i] = (drops[i] || 1) + 1
	}
	
	animationId = requestAnimationFrame(draw)
}

onMounted(() => {
	if (!canvasRef.value) return
	
	ctx = canvasRef.value.getContext('2d')
	resize()
	window.addEventListener('resize', resize)
	
	if (props.active) {
		draw()
	}
})

onUnmounted(() => {
	if (animationId) {
		cancelAnimationFrame(animationId)
	}
	window.removeEventListener('resize', resize)
})

watch(() => props.active, (newVal) => {
	if (newVal && ctx) {
		draw()
	} else if (animationId) {
		cancelAnimationFrame(animationId)
	}
})
</script>

<template>
	<canvas
		ref="canvasRef"
		class="code-rain"
		:style="{ opacity: active ? 1 : 0 }"
	/>
</template>

<style scoped>
.code-rain {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	pointer-events: none;
	z-index: 0;
}
</style>
