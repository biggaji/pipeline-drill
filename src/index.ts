import { connectDatabase } from './infra/database/database.js';
import PipelineService from './service/pipeline.js';
import './infra/queue/worker.js';

// Initiate database connectivity
await connectDatabase();

// Test workflow
(async () => {
  const steps = [
    { name: 'Greet User', params: 'Tobiloba' },
    { name: 'Say Bye', params: 'Dolapo' },
    { name: 'Fetch Todo', params: 3 },
    { name: 'Print Info', params: { info: `params can be of any data type` } },
  ];

  try {
    const pipelineService = new PipelineService('Test Pipeline');
    await pipelineService.createPipeline(steps).then(async (pipeline) => {
      await pipelineService.startPipeline(pipeline._id);
    });
    return;
  } catch (error) {
    console.error('Pipeline operation failed:', error);
    throw error;
  }
})();
