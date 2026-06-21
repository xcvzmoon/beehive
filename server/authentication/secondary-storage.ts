import type { SecondaryStorage } from 'better-auth/db';
import { useStorage } from 'nitro/storage';

type RedisStorageInstance = {
  eval: (script: string, keyCount: number, ...args: (number | string)[]) => Promise<unknown>;
};

const AUTH_STORAGE_MOUNT = 'auth';

const REDIS_GET_AND_DELETE_SCRIPT = `
local value = redis.call("GET", KEYS[1])
if value then
  redis.call("DEL", KEYS[1])
end
return value
`;

const REDIS_INCREMENT_SCRIPT = `
local value = redis.call("INCR", KEYS[1])
local ttl = tonumber(ARGV[1])
if value == 1 and ttl and ttl > 0 then
  redis.call("EXPIRE", KEYS[1], ttl)
end
return value
`;

const authStorage = useStorage<string>(AUTH_STORAGE_MOUNT);
const storageLocks = new Map<string, Promise<unknown>>();

export const secondaryStorage: SecondaryStorage = {
  get: async (key) => authStorage.getItem(key),
  set: async (key, value, ttl) => authStorage.setItem(key, value, getTtlOptions(ttl)),
  delete: async (key) => authStorage.removeItem(key),
  getAndDelete: async (key) => {
    const redisStorage = getAuthRedis();

    if (redisStorage) {
      return redisStorage.redis.eval(
        REDIS_GET_AND_DELETE_SCRIPT,
        1,
        getRedisStorageKey(redisStorage.base, key),
      );
    }

    return runWithStorageLock(key, async () => {
      const value = await authStorage.getItem(key);
      await authStorage.removeItem(key);
      return value;
    });
  },
  increment: async (key: string, ttl: number) => {
    const redisStorage = getAuthRedis();

    if (redisStorage) {
      const value = await redisStorage.redis.eval(
        REDIS_INCREMENT_SCRIPT,
        1,
        getRedisStorageKey(redisStorage.base, key),
        ttl,
      );

      return Number(value);
    }

    return runWithStorageLock(key, async () => {
      const value = Number(await authStorage.getItem(key)) || 0;
      const incrementedValue = value + 1;
      await authStorage.setItem(key, String(incrementedValue), getTtlOptions(ttl));
      return incrementedValue;
    });
  },
};

function getTtlOptions(ttl?: number) {
  return typeof ttl === 'number' && ttl > 0 ? { ttl } : undefined;
}

function normalizeStorageKey(key: string) {
  const [keyWithoutQuery = ''] = key.split('?');
  return keyWithoutQuery.replaceAll(/[/\\]/g, ':').replaceAll(/:+/g, ':').replaceAll(/^:|:$/g, '');
}

function joinStorageKeys(...keys: string[]) {
  return normalizeStorageKey(keys.join(':'));
}

function isRedisStorageInstance(value: unknown): value is RedisStorageInstance {
  return isObject(value) && typeof value.eval === 'function';
}

function getAuthRedis(): { base: string; redis: RedisStorageInstance } | undefined {
  const driver = useStorage().getMount(AUTH_STORAGE_MOUNT).driver;
  const redis: unknown = driver.getInstance?.();

  if (!isRedisStorageInstance(redis)) {
    return undefined;
  }

  const base = getRedisStorageBase(driver.options);
  return { base, redis };
}

function getRedisStorageBase(options: unknown) {
  const base = isObject(options) ? options.base : undefined;
  return typeof base === 'string' ? base : '';
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getRedisStorageKey(base: string, key: string) {
  return base ? joinStorageKeys(base, key) : normalizeStorageKey(key);
}

async function runWithStorageLock<T>(key: string, task: () => Promise<T>) {
  const previous = storageLocks.get(key) ?? Promise.resolve();

  const { promise: current, resolve: release } = createDeferred();

  const queued = previous.then(async () => current);

  storageLocks.set(key, queued);

  await previous;

  try {
    return await task();
  } finally {
    release();

    if (storageLocks.get(key) === queued) {
      storageLocks.delete(key);
    }
  }
}

function createDeferred() {
  let resolve: (() => void) | null = null;
  const promise = new Promise<void>((innerResolve) => {
    resolve = innerResolve;
  });

  return {
    promise,
    resolve: () => resolve?.(),
  };
}
