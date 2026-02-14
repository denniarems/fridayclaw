<script setup lang="ts">
defineProps<{
	enabled?: boolean
}>()
</script>

<template>
	<div class="crt-effects">
		<div class="scanline" />
	</div>
</template>

<style scoped>
.crt-effects {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	pointer-events: none;
	z-index: 9999;
	overflow: hidden;
}

.scanline {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 4px;
	background: rgba(0, 255, 65, 0.08);
	animation: scanline 10s linear infinite;
	pointer-events: none;
}

@keyframes scanline {
	0% {
		transform: translateY(-100%);
	}
	100% {
		transform: translateY(100vh);
	}
}
</style>
