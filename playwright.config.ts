import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'proof/reports/playwright', open: 'never' }]
  ],
  use: { baseURL: 'http://127.0.0.1:8789' },
  webServer: {
    command: 'node scripts/serve-static.mjs',
    port: 8789,
    reuseExistingServer: true,
    timeout: 60_000
  }
});
