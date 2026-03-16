import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Limit concurrency to avoid overwhelming the preprod server with parallel requests.
  // Individual tests within a project still run in parallel via fullyParallel.
  workers: process.env.CI ? 1 : 2,
  reporter: 'html',
  expect: { timeout: 15_000 },
  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on',
    locale: 'cs-CZ',
    timezoneId: 'Europe/Prague',
    // Higher timeouts to account for preprod server latency under load
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'cz',
      // Only run files matching *.cz.spec.ts — any new CZ test file is automatically picked up
      testMatch: /.*\.cz\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://wa-fe-dzb-cz-preview-qa-test.azurewebsites.net',
      },
    },
    {
      name: 'pl',
      // Only run files matching *.pl.spec.ts — placeholder for future PL tests
      testMatch: /.*\.pl\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://wa-fe-dzb-pl-preview-qa-test.azurewebsites.net',
        locale: 'pl-PL',
      },
    },
    {
      name: 'whitelabel',
      // Only run files matching *.whitelabel.spec.ts
      testMatch: /.*\.whitelabel\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://wa-fe-dzb-pluxee-cz-preview-qa-test.azurewebsites.net',
      },
    },
  ],
});
