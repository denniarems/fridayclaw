<script setup lang="ts">
const props = withDefaults(defineProps<{
	title: string
	x?: number
	y?: number
	minimized?: boolean
}>(), {
	x: 10,
	y: 10,
	minimized: false
})

const emit = defineEmits<{
	close: []
}>()

const isDragging = ref(false)
const isMinimized = ref(props.minimized)
const windowRef = ref<HTMLElement | null>(null)
const dragOffset = ref({ x: 0, y: 0 })
const position = ref({ x: props.x, y: props.y })
const zIndex = ref(10)
const isHovered = ref(false)
const isMobile = ref(false)

const bringToFront = () => {
	zIndex.value = Math.max(...windows.value) + 1
	windows.value.push(zIndex.value)
}

const windows = ref([10])

const startDrag = (e: MouseEvent) => {
	if (isMobile.value) return
	
	isDragging.value = true
	bringToFront()
	
	const rect = windowRef.value?.getBoundingClientRect()
	if (rect) {
		dragOffset.value = {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top
		}
	}
	
	document.addEventListener('mousemove', onDrag)
	document.addEventListener('mouseup', stopDrag)
}

const onDrag = (e: MouseEvent) => {
	if (!isDragging.value) return
	
	position.value = {
		x: e.clientX - dragOffset.value.x,
		y: e.clientY - dragOffset.value.y
	}
}

const stopDrag = () => {
	isDragging.value = false
	document.removeEventListener('mousemove', onDrag)
	document.removeEventListener('mouseup', stopDrag)
}

const toggleMinimize = () => {
	isMinimized.value = !isMinimized.value
}

const close = () => {
	emit('close')
}

const handleResize = () => {
	isMobile.value = window.innerWidth < 768
	if (isMobile.value) {
		position.value = { x: 0, y: 0 }
	}
}

onMounted(() => {
	isMobile.value = window.innerWidth < 768
	if (isMobile.value) {
		position.value = { x: 0, y: 0 }
	}
	
	bringToFront()
	
	window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
	window.removeEventListener('resize', handleResize)
})
</script>

<template>
	<div
		ref="windowRef"
		:class="[
			'draggable-window',
			{ minimized: isMinimized, dragging: isDragging, hovered: isHovered }
		]"
		:style="{
			left: position.x + 'px',
			top: position.y + 'px',
			zIndex: zIndex
		}"
		@mouseenter="isHovered = true"
		@mouseleave="isHovered = false"
	>
		<div
			class="draggable-window-header"
			@mousedown="startDrag"
		>
			<div class="draggable-window-controls">
				<div class="draggable-window-btn minimize" @click.stop="toggleMinimize" title="Minimize">
					<span v-if="isMinimized">+</span>
				</div>
				<div class="draggable-window-btn maximize" title="Maximize">
				</div>
				<div class="draggable-window-btn close" @click.stop="close" title="Close">
				</div>
			</div>
			<span class="draggable-window-title">▸ {{ title }}</span>
			<div style="width: 50px;"></div>
		</div>
		
		<div v-if="!isMinimized" class="draggable-window-content">
			<slot />
		</div>
		
		<div v-else class="draggable-window-minimized">
			{{ title }}
		</div>
	</div>
</template>

<style scoped>
.draggable-window {
	position: absolute;
	background: rgba(0, 0, 0, 0.95);
	border: 1px solid #00ff41;
	border-radius: 6px;
	box-shadow: 
		0 0 10px rgba(0, 255, 65, 0.2),
		inset 0 0 30px rgba(0, 255, 65, 0.03);
	overflow: hidden;
	min-width: 320px;
	max-width: 450px;
	transition: box-shadow 0.2s, border-color 0.2s;
}

.draggable-window.hovered {
	border-color: #00ff41;
	box-shadow: 
		0 0 20px rgba(0, 255, 65, 0.3),
		inset 0 0 30px rgba(0, 255, 65, 0.05);
}

.draggable-window.dragging {
	cursor: grabbing;
	user-select: none;
}

.draggable-window.minimized {
	min-width: 150px;
}

.draggable-window-header {
	background: linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%);
	padding: 8px 12px;
	cursor: move;
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-bottom: 1px solid #333;
	user-select: none;
	min-height: 36px;
}

.draggable-window-controls {
	display: flex;
	gap: 8px;
	align-items: center;
}

.draggable-window-btn {
	width: 12px;
	height: 12px;
	border-radius: 50%;
	cursor: pointer;
	transition: opacity 0.2s;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 10px;
	color: #000;
	font-weight: bold;
}

.draggable-window-btn:hover {
	opacity: 0.8;
}

.draggable-window-btn.close {
	background: #ff5f57;
}

.draggable-window-btn.minimize {
	background: #febc2e;
}

.draggable-window-btn.maximize {
	background: #28c840;
}

.draggable-window-btn.minimize span {
	color: #000;
	font-weight: bold;
}

.draggable-window-title {
	color: #00ff41;
	font-size: 12px;
	font-family: 'Courier New', monospace;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.draggable-window-content {
	padding: 16px;
	color: #00ff41;
	font-family: 'Courier New', monospace;
	font-size: 13px;
	line-height: 1.6;
	max-height: 400px;
	overflow-y: auto;
}

.draggable-window-minimized {
	padding: 8px 12px;
	color: #00ff41;
	font-family: 'Courier New', monospace;
	font-size: 12px;
	cursor: pointer;
}

@media (max-width: 768px) {
	.draggable-window {
		position: relative;
		width: 100% !important;
		left: auto !important;
		top: auto !important;
		margin-bottom: 20px;
	}
}
</style>
