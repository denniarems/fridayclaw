import { createRoot } from 'react-dom/client'
import { StartClient } from '@tanstack/react-start/client'
import { RouterProvider } from '@tanstack/react-router'
import { createRouter } from './router'

const router = createRouter()

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('app')!).render(
  <RouterProvider router={router} />
)
