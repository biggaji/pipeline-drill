import { Worker } from 'bullmq';
import redis from '../redis/redis.js';
import PipelineService from '../../service/pipeline.js';

const workerQueuePipelineService = new PipelineService();
const pipelineWorker = new Worker(
  'pipeline',
  async (job) => {
    try {
      // This does the execution
      const { pipelineId, stepName, stepParams } = job.data;
      await workerQueuePipelineService.executeStep(pipelineId, stepName, stepParams);
    } catch (error) {
      //@ts-ignore
      console.error(`error processing workflow step: ${job.data.stepName}:`, error);
      throw error;
    }
  },
  {
    connection: redis,
  },
);

pipelineWorker.on('completed', (job: any) => {
  console.log(`workflow step: '${job.data.stepName}' processed`);
});

pipelineWorker.on('error', (err) => {
  console.error('queue worker error:', err.message);
});

export { pipelineWorker };
