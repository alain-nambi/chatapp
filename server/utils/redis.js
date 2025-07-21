import { createClient } from "redis";

let redisClient;

export const connectRedis = async () => {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL,
    });

    redisClient.on('error', (err) => console.error('Redis Client Error', err));

    await redisClient.connect();
    console.log('✅ Redis client connected');
  }
  return redisClient;
}
