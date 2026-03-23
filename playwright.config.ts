import { defineConfig, devices } from '@playwright/test';
import type { ProjectOptions } from './tests/fixtures';

export default defineConfig<ProjectOptions>({
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
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://wa-fe-dzb-cz-preview-qa-test.azurewebsites.net',
        projectPaymentMethods: [
          'edenred-benefit-card',
          'edenred-cafeteria',
          'up-benefit-card',
          'pluxee-benefit-card',
          'payment-card',
          'bank-transfer',
        ],
        projectValidationErrors: {
          missingFieldErrors: ['zadejte prosím', 'V objednávkovém formuláři se vyskytují chyby.'],
          uncheckedTermsErrors: ['povinné pole', 'V objednávkovém formuláři se vyskytují chyby.'],
        },
      },
    },
    {
      name: 'pl',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://wa-fe-dzb-pl-preview-qa-test.azurewebsites.net',
        locale: 'pl-PL',
        // PL not yet implemented — add payment methods and validation errors here to enable tests
        projectPaymentMethods: [],
        projectValidationErrors: { missingFieldErrors: [], uncheckedTermsErrors: [] },
      },
    },
    {
      name: 'whitelabel',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://wa-fe-dzb-pluxee-cz-preview-qa-test.azurewebsites.net',
        projectPaymentMethods: ['pluxee-benefit-card', 'payment-card', 'bank-transfer'],
        projectValidationErrors: {
          missingFieldErrors: ['Povinné pole'],
          uncheckedTermsErrors: ['Povinné pole'],
        },
      },
    },
  ],
});
