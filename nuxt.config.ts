// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },

	css: ['~/assets/css/main.css'],

	modules: [
		'@nuxt/ui',
		'@nuxt/icon',
		'@nuxt/hints',
		'@nuxt/image',
		'@nuxt/scripts',
		'@formkit/nuxt',
		'@hypernym/nuxt-anime',
		'@nuxtjs/device',
		'@nuxtjs/google-fonts',
		'@nuxtjs/seo',
		'@pinia/nuxt',
		'@tresjs/nuxt',
		'@vueuse/nuxt',
	],

	ui: {
		theme: {
			colors: ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error'],
		},
	},
})
