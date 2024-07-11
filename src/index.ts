import { connectDatabase } from './infra/database/database.js';
import PipelineService from './service/pipeline.js';
import './infra/queue/worker.js';

// Initiate database connectivity
await connectDatabase();

// Test workflow
(async () => {
  const steps = [
    { name: 'Greet User', params: 'Tobi' },
    { name: 'Say Bye', params: 'Dolapo' },
    { name: 'Fetch Todo', params: 3 },
    { name: 'Name Data', params: { name: 'tobi' } },
  ];
  const pipelineManager = new PipelineService('Test Pipeline');

  try {
    const pipeline = await pipelineManager.createPipeline(steps).then(async (pipeline) => {
      await pipelineManager.startPipeline(pipeline._id);
    });
  } catch (error) {
    console.error('Pipeline failed:', error);
  }
})();
