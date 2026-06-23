import type * as SecondaryStorageModule from '~/server/authentication/secondary-storage.ts';
import { beforeEach, describe, expect, it, vi } from 'vite-plus/test';

type StoredValue = string | null;
type StorageOptions = { ttl?: number } | undefined;

const missingOptions = void 0;

const backingStore = vi.hoisted(() => ({
  values: new Map<string, string>(),
  getItem: vi.fn(async (key: string): Promise<StoredValue> => backingStore.values.get(key) ?? null),
  setItem: vi.fn(async (key: string, value: string, _options?: StorageOptions): Promise<void> => {
    backingStore.values.set(key, value);
  }),
  removeItem: vi.fn(async (key: string): Promise<void> => {
    backingStore.values.delete(key);
  }),
}));

vi.mock('nitro/storage', () => ({
  useStorage: (mount?: string) => {
    if (mount === 'auth') {
      return backingStore;
    }

    return {
      getMount: () => ({
        driver: {
          options: {},
          getInstance: () => null,
        },
      }),
    };
  },
}));

beforeEach(() => {
  vi.resetModules();
  backingStore.values.clear();
  backingStore.getItem.mockClear();
  backingStore.setItem.mockClear();
  backingStore.removeItem.mockClear();
});

describe('Better Auth secondary storage', () => {
  it('performs get-and-delete atomically under concurrent OTP redemption attempts', async () => {
    const storageModule = await loadSecondaryStorageModule();
    const getAndDelete = requireStorageMethod(
      storageModule.secondaryStorage.getAndDelete,
      'getAndDelete',
    );
    backingStore.values.set('otp:user-1', '123456');
    backingStore.getItem.mockImplementation(async (key: string) => {
      await delay();
      return backingStore.values.get(key) ?? null;
    });
    backingStore.removeItem.mockImplementation(async (key: string) => {
      await delay();
      backingStore.values.delete(key);
    });

    const attempts = await Promise.all([
      getAndDelete('otp:user-1'),
      getAndDelete('otp:user-1'),
      getAndDelete('otp:user-1'),
    ]);

    expect(attempts.filter((value) => value === '123456')).toHaveLength(1);
    expect(attempts.filter((value) => value === null)).toHaveLength(2);
    expect(backingStore.values.has('otp:user-1')).toBe(false);
  });

  it('serializes concurrent rate-limit increments so no attempt is lost', async () => {
    const storageModule = await loadSecondaryStorageModule();
    const increment = requireStorageMethod(storageModule.secondaryStorage.increment, 'increment');
    const attemptCount = 25;
    backingStore.getItem.mockImplementation(async (key: string) => {
      await delay();
      return backingStore.values.get(key) ?? null;
    });
    backingStore.setItem.mockImplementation(async (key: string, value: string) => {
      await delay();
      backingStore.values.set(key, value);
    });

    const increments = await Promise.all(
      Array.from({ length: attemptCount }, async () => increment('rate-limit:sign-in:user-2', 60)),
    );

    expect(new Set(increments).size).toBe(attemptCount);
    expect(Math.min(...increments)).toBe(1);
    expect(Math.max(...increments)).toBe(attemptCount);
    expect(backingStore.values.get('rate-limit:sign-in:user-2')).toBe(String(attemptCount));
  });

  it('passes positive TTL values to Nitro storage and omits invalid TTL metadata', async () => {
    const storageModule = await loadSecondaryStorageModule();

    await storageModule.secondaryStorage.set('short-lived', 'value', 120);
    await storageModule.secondaryStorage.set('session', 'value', 0);

    expect(backingStore.setItem).toHaveBeenNthCalledWith(1, 'short-lived', 'value', { ttl: 120 });
    expect(backingStore.setItem).toHaveBeenNthCalledWith(2, 'session', 'value', missingOptions);
  });
});

async function loadSecondaryStorageModule(): Promise<typeof SecondaryStorageModule> {
  return import('~/server/authentication/secondary-storage.ts');
}

function requireStorageMethod<T>(method: T | undefined, name: string): T {
  if (!method) {
    throw new Error(`Expected secondary storage method ${name} to be implemented`);
  }

  return method;
}

async function delay() {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, 1);
  });
}
