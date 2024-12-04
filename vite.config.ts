import {defineConfig} from 'vitest/config'
import {sveltekit} from '@sveltejs/kit/vite'
import {svelteTesting} from '@testing-library/svelte/vite'
import viteTsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [sveltekit(), svelteTesting(), viteTsconfigPaths()],
  test: {
    environment: 'happy-dom',
    globals: true,
    clearMocks: true,
    mockReset: true
  }
})
