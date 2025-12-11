import { createClient } from 'redis';

let redisClient: ReturnType<typeof createClient> | null = null;
let isRedisConnected = false;

export const initializeRedis = async () => {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        // Don't keep trying to reconnect if Redis is unavailable
        reconnectStrategy: (retries) => {
          if (retries > 3) {
            console.log('⚠️  Redis connection failed after 3 retries. Running without Redis.');
            return false; // Stop reconnecting
          }
          return Math.min(retries * 50, 500); // Exponential backoff
        },
      },
    });

    // Only log errors if Redis was previously connected
    redisClient.on('error', (err) => {
      if (isRedisConnected) {
        console.error('Redis Client Error:', err);
      }
      // Silently fail if never connected
    });

    redisClient.on('connect', () => {
      isRedisConnected = true;
      console.log('✅ Redis client connected');
    });

    redisClient.on('reconnecting', () => {
      console.log('🔄 Redis reconnecting...');
    });

    await redisClient.connect();
    
    return redisClient;
  } catch (error) {
    // Silently fail and return null
    redisClient = null;
    isRedisConnected = false;
    return null;
  }
};

export const getRedisClient = () => {
  if (!redisClient || !isRedisConnected) {
    return null; // Return null instead of throwing error
  }
  return redisClient;
};

export const isRedisAvailable = () => {
  return isRedisConnected && redisClient !== null;
};

export { redisClient };
