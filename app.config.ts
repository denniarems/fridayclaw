import { createApp } from 'vinxi'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'

export default createApp({
  name: 'fridayclaw',
  routers: [
    {
      name: 'client',
      type: 'client',
      handler: './src/entry-client.tsx',
      plugins() {
        return [
          tailwindcss(),
          tanstackRouter({
            routeTreeGenDir: '.',
          }),
        ]
      },
    },
    {
      name: 'server',
      type: 'http',
      handler: './src/entry-server.tsx',
    },
  ],
})
