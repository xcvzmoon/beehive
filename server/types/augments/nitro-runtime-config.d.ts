import type { NitroRuntimeConfig } from 'nitropack/types';

declare module 'nitropack/types' {
  interface NitroRuntimeConfig {
    db: {
      host: string;
      port: number;
      database: string;
      user: string;
      password: string;
      ssl: boolean;
    };
    api: {
      baseURL: string;
    };
  }
}

export {};
