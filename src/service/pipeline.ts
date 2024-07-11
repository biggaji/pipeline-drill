import { Types } from 'mongoose';
import { Pipeline } from '../model/pipeline.js';
import { pipelineStatusEnum } from '../enum/pipeline.enum.js';
import stepRegistry from '../registry/registry.js';
import { pipelineQueue } from '../infra/queue/queue.js';

/**
 * @class PipelineService
 * @description Manages a pipeline lifecycle
 */
export default class PipelineService {
  public pipelineName?: string = 'PipeQ';

  constructor(pipelineName?: string) {
    this.pipelineName = pipelineName;
  }

  /**
   * @method createPipeline
   * @description Creates a new pipeline
   * @memberof PipelineService
   * @param steps
   * @returns
   */
  async createPipeline(steps: any[]) {
    try {
      const pipeline = new Pipeline({
        name: this.pipelineName,
        steps: steps.map((step) => ({
          name: step.name,
          params: step.params,
        })),
      });
      return await pipeline.save();
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method startPipeline
   * @description Starts a pipeline workflow
   * @memberof PipelineService
   * @param pipelineId
   */
  async startPipeline(pipelineId: Types.ObjectId) {
    try {
      const pipeline = await Pipeline.findById(pipelineId);
      if (!pipeline) {
        throw new Error(`Pipeline with id: '${pipelineId}' not found`);
      }

      pipeline.status = pipelineStatusEnum.IN_PROGRESS;

      // Add steps to work queue
      for (const step of pipeline.steps) {
        if (step.status === pipelineStatusEnum.PENDING) {
          const workerPayload = {
            pipelineId,
            stepName: step.name,
            stepParams: step.params,
          };

          await pipelineQueue.add('pipeline', workerPayload);
        }
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method restartPipeline
   * @description Restarts a failed or successful pipeline
   * @memberof PipelineService
   * @param pipelineId
   */
  async restartPipeline(pipelineId: Types.ObjectId) {
    try {
      const pipeline = await Pipeline.findById(pipelineId);
      if (!pipeline) {
        throw new Error(`Pipeline with id: '${pipelineId}' not found`);
      }

      // Reset the steps back to it initial state
      for (const step of pipeline.steps) {
        step.status = pipelineStatusEnum.PENDING;
        step.error = '';
        step.startedAt = null;
        step.completedAt = null;
      }

      pipeline.status = pipelineStatusEnum.PENDING;
      await pipeline.save();

      // Start the pipeline again
      await this.startPipeline(pipelineId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method executeStep
   * @description Executes each steps within a pipeline
   * @memberof PipelineService
   * @param pipelineId
   * @param stepName
   * @param stepParams
   */
  async executeStep(
    pipelineId: Types.ObjectId,
    stepName: string,
    stepParams: any,
  ) {
    try {
      const pipeline = await Pipeline.findById(pipelineId);
      if (!pipeline) {
        throw new Error(`Pipeline with id: '${pipelineId}' not found`);
      }

      const step = pipeline.steps.find((s) => s.name === stepName);
      if (!step) {
        throw new Error('Step not found');
      }

      try {
        step.status = pipelineStatusEnum.IN_PROGRESS;
        step.startedAt = new Date();
        await pipeline.save();

        // Handle a step
        await this.performStep(stepName, stepParams);

        step.status = pipelineStatusEnum.COMPLETED;
        step.completedAt = new Date();
      } catch (error: any) {
        step.status = pipelineStatusEnum.FAILED;
        step.error = error.message;
        pipeline.status = pipelineStatusEnum.FAILED;
      } finally {
        // Saves the changes no matter what
        await pipeline.save();
      }

      // Update the pipeline status if every step has a completed status
      if (
        pipeline.steps.every((s) => s.status === pipelineStatusEnum.COMPLETED)
      ) {
        pipeline.status = pipelineStatusEnum.COMPLETED;
        await pipeline.save();
      }

      return 'done';
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method performStep
   * @description Uses the step registry functions to execute each steps
   * @memberof PipelineService
   * @param stepName
   * @param stepParams
   */
  async performStep(stepName: string, stepParams: any) {
    try {
      const stepFunction = stepRegistry[stepName];
      if (!stepFunction) {
        throw new Error(`Unknown step: ${stepName}`);
      }

      await stepFunction(stepParams);
      return;
    } catch (error) {
      throw error;
    }
  }
}
