# AGENTS.md - Development Guide for FridayClaw

## Project Overview

- **Framework:** Nuxt 4.3.1 with Vue 3.5
- **Language:** TypeScript
- **Package Manager:** pnpm (uses pnpm-lock.yaml)
- **Modules:** @pinia/nuxt, @vueuse/nuxt, @nuxt/image, @nuxtjs/seo, @tresjs/nuxt, @formkit/nuxt, @nuxtjs/device, @nuxtjs/google-fonts, @hypernym/nuxt-anime

## Commands

### Development

```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server at http://localhost:3000
```

### Production

```bash
pnpm build            # Build for production
pnpm generate         # Generate static site
pnpm preview          # Preview production build
```

### Testing & Linting

**Note:** No lint or test scripts currently configured. To add:

```bash
pnpm add -D eslint @nuxt/eslint vitest @nuxt/test
```

Run a single test when configured:

```bash
pnpm vitest run --reporter=verbose path/to/test.file.test.ts
```

## Available Skills

Agents have access to these skills in `.agents/skills/`. Use them appropriately:

- **vue-best-practices** - MUST use for Vue tasks (Composition API, TypeScript, script setup)
- **vue** - Vue 3 Composition API, reactivity, built-in components
- **nuxt** - Nuxt-specific patterns (auto-imports, server routes, SSR)
- **frontend-design** - Production-grade UI creation
- **nuxt-ui** - @nuxt/ui v4 components and theming
- **create-adaptable-composable** - For creating library-grade composables with MaybeRef inputs
- **vue-debug-guides** - Debugging Vue runtime errors, hydration issues
- **web-design-guidelines** - UI accessibility and UX best practices
- **agent-browser** - Browser automation for testing
- **pnpm** - Package manager specifics

## Project Structure

```
fridayclaw/
├── app/
│   ├── app.vue           # Main app entry
│   ├── pages/            # Route pages (auto-routed)
│   ├── components/       # Vue components
│   ├── composables/      # Vue composables (useXxx)
│   ├── stores/           # Pinia stores
│   └── layouts/          # Layout components
├── nuxt.config.ts        # Nuxt configuration
├── tsconfig.json         # TypeScript config
└── package.json
```

## Code Style Guidelines

### TypeScript

- Always use explicit types for function parameters and return values
- Use `interface` for object shapes, `type` for unions/aliases
- Enable strict mode in tsconfig (inherited from Nuxt)
- Prefer `as const` for literal types

### Vue Components (MUST follow vue-best-practices skill)

- Use `<script setup lang="ts">` syntax exclusively
- Use Composition API with composables
- Define props with `defineProps<Props>()`
- Emit events with `defineEmits<Emits>()`
- Use `defineModel` for two-way binding
- Leverage `v-memo`, `useTemplateRef`, `useSlots` when needed

### Nuxt-Specific (follow nuxt skill)

- Use auto-imported composables from `#app`
- Leverage `useFetch`/`useAsyncData` for data fetching
- Use `useState` for shared reactive state
- Follow Nuxt directory conventions

### Naming Conventions

- **Components:** PascalCase (e.g., `HeroSection.vue`, `UserCard.vue`)
- **Composables:** camelCase with `use` prefix (e.g., `useAuth.ts`, `useTheme.ts`)
- **Stores:** PascalCase (e.g., `UserStore.ts`, `SettingsStore.ts`)
- **Types/Interfaces:** PascalCase (e.g., `UserProfile`, `ApiResponse`)
- **Constants:** UPPER_SNAKE_CASE
- **Variables/Functions:** camelCase

### File Naming

- Use kebab-case for all files: `hero-section.vue`, `use-auth.ts`
- Component files: `XxxComponent.vue` or descriptive: `the-header.vue`

### Import Order

Organize imports in this order:

1. Vue/Nuxt built-ins: `import { ref, computed } from 'vue'`
2. Nuxt composables: `import { useRoute } from '#app'`
3. Third-party libraries
4. Local modules: `import { useAuth } from '~/composables'`
5. Local components: `import HeroSection from '~/components/HeroSection.vue'`

### Template Style

- Self-closing tags for void elements: `<Component />`
- Use `v-bind` shorthand: `:` instead of `v-bind:`
- Use `@` instead of `v-on:`
- Use `v-if`/`v-else-if`/`v-else` over ternary in templates
- Always use `:key` with `v-for`
- Prefer `v-show` for frequent toggling, `v-if` for conditional rendering

### CSS & Styling

- Use utility classes (Tailwind CSS patterns if available)
- Scoped styles with `<style scoped>`
- CSS variables for theming when needed
- Follow design system tokens if established

### Error Handling

- Use try/catch with async/await, provide user feedback
- Leverage Vue error boundaries for component-level errors
- Use Pinia store error states for API failures
- Log errors appropriately (console.error in development)
- Handle hydration mismatches (see vue-debug-guides skill)

### State Management (Pinia)

- Define stores with TypeScript
- Use composition store syntax: `export const useXxxStore = defineStore('xxx', () => { ... })`
- Keep stores focused (one store per domain)
- Use store refs for reactivity: `const count = storeToRefs(store).count`

### Composables

- Prefix with `use`: `useXxx`
- Return reactive refs and plain functions
- Handle cleanup with `onUnmounted` if needed
- Use `toValue()` for normalizing MaybeRef inputs (see create-adaptable-composable skill)

### Accessibility (follow web-design-guidelines skill)

- Use semantic HTML elements
- Include ARIA attributes where needed
- Ensure keyboard navigation works
- Test with screen readers

## Recommendations for Future

1. **Add ESLint:** Run `npx nuxi@latest module add eslint`
2. **Add Testing:** Run `npx nuxi@latest module add test-utils` or set up Vitest manually
3. **Add Prettier:** For code formatting consistency
4. **CI/CD:** Add GitHub Actions for lint/test on PRs

## Development Notes

- DevTools are enabled (`devtools: { enabled: true }` in nuxt.config.ts)
- Compatibility date: 2025-07-15
- Uses Vue 3.5 features and Nuxt 4 conventions
- Check `.agents/skills/` directory for detailed guidance on specific tasks
