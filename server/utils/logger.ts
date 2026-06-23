import { createConsola } from 'consola';
import { Effect } from 'effect';
import { appendFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { appConfig } from '~/server/config/app.ts';

const LOG_DIR = 'logs';

mkdirSync(LOG_DIR, { recursive: true });

export const logger = createConsola();

function getLogFile(): string {
  const date = new Date().toISOString().slice(0, 10);
  return join(LOG_DIR, `${date}.log`);
}

function normalize(level: string, ...args: unknown[]): string {
  const timestamp = new Date().toISOString();
  const message = args
    .map((arg) => (typeof arg !== 'string' ? JSON.stringify(arg) : arg))
    .join(' ')
    .trim();

  return `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
}

logger.addReporter({
  log: (logObj) => {
    if (!appConfig.enableTerminalLogs) {
      return;
    }

    Effect.runSync(
      Effect.try({
        try: () => {
          const level = logObj.type;
          const data = normalize(level, ...(logObj.args as unknown[]));
          appendFileSync(getLogFile(), data);
        },
        catch: (error) => {
          throw new Error(
            error instanceof Error
              ? error.message
              : 'An error occurred while trying to append data to the log file',
          );
        },
      }),
    );
  },
});
