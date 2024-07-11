import { Queue } from 'bullmq';
import redis from '../redis/redis.js';

/**
 * Pipeline Queue
 */
const pipelineQueue = new Queue('pipeline', {
  connection: redis,
});

console.log('Pipeline queue initialized');

export { pipelineQueue };
