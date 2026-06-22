import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadEnvFile } from 'node:process';

const environmentFile = resolve('.env');

if (existsSync(environmentFile)) {
  loadEnvFile(environmentFile);
}

const jitiCommand = resolve(
  process.platform === 'win32' ? 'node_modules/.bin/jiti.cmd' : 'node_modules/.bin/jiti',
);

const result = spawnSync(jitiCommand, ['server/database/seed/catalog.ts'], {
  env: { ...process.env, JITI_TSCONFIG_PATHS: 'true' },
  stdio: 'inherit',
});

if (result.error) {
  throw result.error;
}

process.exitCode = result.status ?? 1;
