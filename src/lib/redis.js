import Redis from "ioredis";

const memoryStore = new Map();

function readMemoryValue(key) {
  const entry = memoryStore.get(key);
  if (!entry) {
    return undefined;
  }

  if (entry.expiresAt && entry.expiresAt <= Date.now()) {
    memoryStore.delete(key);
    return undefined;
  }

  return entry.value;
}

function createMemoryRedis() {
  return {
    async get(key) {
      return readMemoryValue(key);
    },
    async set(key, value, mode, duration) {
      const expiresAt = mode === "EX" && typeof duration === "number"
        ? Date.now() + duration * 1000
        : undefined;

      memoryStore.set(key, { value, expiresAt });
      return "OK";
    },
    async del(...keys) {
      let deleted = 0;
      for (const key of keys) {
        if (memoryStore.delete(key)) {
          deleted += 1;
        }
      }
      return deleted;
    },
  };
}

function createRedisClient() {
  const client = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    lazyConnect: true,
    connectTimeout: 1000,
    maxRetriesPerRequest: 1,
    retryStrategy: () => null,
    enableOfflineQueue: false,
  });

  client.on("error", () => {
    // Swallow connection errors here; callers fall back to memory.
  });

  return client;
}

const redisClient = global.redisClient || createRedisClient();
const fallbackRedis = createMemoryRedis();

if (process.env.NODE_ENV === "development") {
  global.redisClient = redisClient;
}

async function callRedis(method, ...args) {
  try {
    return await redisClient[method](...args);
  } catch {
    return fallbackRedis[method](...args);
  }
}

const redis = {
  get: (...args) => callRedis("get", ...args),
  set: (...args) => callRedis("set", ...args),
  del: (...args) => callRedis("del", ...args),
  quit: () => redisClient.quit().catch(() => undefined),
};

export default redis;
