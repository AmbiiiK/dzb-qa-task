import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import prettier from 'eslint-plugin-prettier/recommended';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    // Ignore generated output directories — these contain minified Playwright assets
    // that would otherwise flood lint output with thousands of false positives.
    ignores: ['node_modules/**', 'playwright-report/**', 'test-results/**'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js },
    extends: ['js/recommended', playwright.configs['flat/recommended']],
    languageOptions: { globals: globals.browser },
    rules: {
      'playwright/expect-expect': [
        'error',
        {
          assertFunctionNames: [
            'expect',
            'expectSuccess',
            'expectOrderNumber',
            'expectPaymentDetails',
            'expectPaymentLink',
            'expectRecap',
            'purchaseVoucher',
          ],
        },
      ],
    },
  },
  tseslint.configs.recommended,
  prettier,
]);
