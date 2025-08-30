const redis = require('redis');

let redisClient = null;
console.log("process.env.REDIS_URL",process.env.REDIS_URL)
const connectRedis = async () => {
  // Only try to connect if Redis URL is provided
  if (!process.env.REDIS_URL) {
    console.log('⚠️ Redis URL not provided, skipping Redis connection');
    return null;
  }

  try {
    // Create Redis client
    redisClient = redis.createClient({
      url: process.env.REDIS_URL,
      retry_strategy: (options) => {
        if (options.error && options.error.code === 'ECONNREFUSED') {
          console.log('❌ Redis server connection refused');
          return new Error('Redis server connection refused');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
          console.log('❌ Redis retry time exhausted');
          return new Error('Retry time exhausted');
        }
        if (options.attempt > 10) {
          console.log('❌ Redis max retry attempts reached');
          return undefined;
        }
        return Math.min(options.attempt * 100, 3000);
      }
    });

    redisClient.on('error', (err) => {
      console.log('❌ Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis connected');
    });

    redisClient.on('ready', () => {
      console.log('✅ Redis ready');
    });

    redisClient.on('end', () => {
      console.log('❌ Redis connection ended');
    });

    await redisClient.connect();
    return redisClient;
  } catch (err) {
    console.error('❌ Redis connection error:', err);
    // Continue without Redis if connection fails
    return null;
  }
};

const getRedisClient = () => redisClient;

module.exports = {
  connectRedis,
  getRedisClient
};