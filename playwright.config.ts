import {defineConfig} from '@playwright/test'

const port = 4173

export default defineConfig({
  webServer: {
    command: 'pnpm run build && pnpm run preview',
    port
  },
  use: {
    baseURL: `http://localhost:${port}`
  },
  testDir: 'e2e',
  testMatch: /(.+\.)?(,test|spec)\.[jt]s/,
  fullyParallel: true,
  forbidOnly: !!process.env.CI
})
