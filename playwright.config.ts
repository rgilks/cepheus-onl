import { defineConfig, devices } from '@playwright/test';

const port = process.env.PORT || '3000';
const baseURL = `http://localhost:${port}`;

const isCI = !!(
  process.env.CI ||
  process.env.AWS_BRANCH ||
  process.env.AWS_APP_ID ||
  process.env.AMPLIFY_BUILD ||
  process.env.CONTINUOUS_INTEGRATION ||
  process.env.BUILD_NUMBER
);

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: [['html', { open: 'never' }]],
  timeout: 40000,
  outputDir: 'test-results/',
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: isCI
    ? [
        {
          name: 'chromium',
          use: { ...devices['Desktop Chrome'] },
        },
      ]
    : [
        {
          name: 'chromium',
          use: { ...devices['Desktop Chrome'] },
        },
        {
          name: 'firefox',
          use: { ...devices['Desktop Firefox'] },
        },
        {
          name: 'webkit',
          use: { ...devices['Desktop Safari'] },
        },
      ],

  webServer: {
    command: `npm run dev -- -p ${port}`,
    port: parseInt(port),
    reuseExistingServer: !isCI,
    timeout: 120000,
  },
});
