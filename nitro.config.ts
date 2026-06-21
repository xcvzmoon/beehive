import { defineConfig } from 'nitro';

export default defineConfig({
  compatibilityDate: '2026-06-20',
  serverDir: './server',
  serverAssets: [
    {
      baseName: 'templates',
      dir: 'server/templates',
      pattern: '**/*.hbs',
    },
  ],
  storage: {
    auth: {
      driver: 'redis',
      base: 'auth',
      url: process.env.REDIS_URL,
    },
    cache: {
      driver: 'redis',
      url: process.env.REDIS_URL,
    },
  },
});
