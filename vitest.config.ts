import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      // `@lib/*` mirrors the alias in tsconfig.json.
      '@lib': fileURLToPath(new URL('./src/lib', import.meta.url)),
      // The Cloudflare Workers virtual module is not available under Node; the
      // stub exports a mutable `env` so tests can vary `ALLOWED_ORIGINS`.
      'cloudflare:workers': fileURLToPath(
        new URL('./test/stubs/cloudflare-workers.ts', import.meta.url),
      ),
    },
  },
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/lib/**', 'src/pages/api/**'],
    },
  },
});
