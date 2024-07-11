import { config } from 'dotenv';
import Redis from 'ioredis';

config();

const redis = new Redis(process.env.REDIS_URI!, { maxRetriesPerRequest: null });

redis.on('connect', () => {
  console.log('Connected to redis');
});

redis.on('error', (err) => {
  console.error('Error connecting to redis:', err);
});

export default redis;
