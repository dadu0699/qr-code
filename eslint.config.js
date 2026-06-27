import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    ignores: ['dist/', '.astro/', 'coverage/', 'node_modules/', 'worker-configuration.d.ts'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    rules: {
      // TypeScript and `astro check` already report undefined identifiers, and
      // they understand the Cloudflare/browser globals; avoid duplicate errors.
      'no-undef': 'off',
    },
  },
]);
