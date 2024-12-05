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
    mockReset: true,
    exclude: [
      '**/build/**',
      '.svelte-kit',
      './e2e/**',
      // Defaults
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*'
    ]
  }
})
