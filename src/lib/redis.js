import Redis from "ioredis";

let redis;

if (!global.redis) {
  redis = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
  });

  // Optional: for dev hot reload to not create multiple connections
  if (process.env.NODE_ENV === "development") global.redis = redis;
} else {
  redis = global.redis;
}

export default redis;
