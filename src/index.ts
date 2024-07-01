import { connectDatabase } from './infra/database/database';

/**
 * BUILD A MESSAGE CONVERSATION TEMPLATE. THAT ALSO DOES TRANSALATION
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import * as steps from './steps/task1.task.js';

const rootDir = process.cwd();

export type PipelineStep = {
  name: string;
  steps: PipelineStepActionParams[];
};

export type PipelineStepActionParams = {
  name: string;
  action: string;
};

export type Pipeline = {
  pipelines: PipelineStep[];
};

class PipelineManager {
  private pipelineDefinitions: Pipeline | null;
  public pipelineDefinitionFile: string;

  constructor(pipelineDefinitionFile: string) {
    this.pipelineDefinitionFile = pipelineDefinitionFile;
    this.pipelineDefinitions = null;
  }

  async loadPipelineDefinitions() {
    try {
      const filePath = path.resolve(rootDir, this.pipelineDefinitionFile);
      const fileContent = await fs.readFile(filePath, {
        encoding: 'utf-8',
      });
      this.pipelineDefinitions = JSON.parse(fileContent);
    } catch (error) {
      console.error('Error loading pipeline definitions', error);
      throw error;
    }
  }

  async runPipeline(pipelineName: string, name: string) {
    try {
      if (!this.pipelineDefinitions) {
        await this.loadPipelineDefinitions();
      }

      const pipeline = this.pipelineDefinitions!.pipelines.find((p) => p.name === pipelineName);

      if (!pipeline) {
        throw new Error(`Pipeline ${pipelineName} not found`);
      }

      for (const step of pipeline.steps) {
        // @ts-ignore
        const stepFunction = steps[step.action];
        if (!stepFunction) {
          throw new Error(`Function ${step.action} not found for step ${step.name}`);
        }
        console.log('Starting ', step.action, '....');
        await stepFunction(name);
        console.log('Finished ', step.action, '....');
      }
    } catch (error) {
      console.error('Error executing pipeline task', error);
      throw error;
    }
  }
}

// Usage example
(async () => {
  const pipelineService = new PipelineManager('pipelineDefinition.json');
  try {
    await pipelineService.runPipeline('BasicGesturePipeline', 'Jamie');
    console.log('Pipeline executed successfully');
  } catch (error: any) {
    console.error(`Pipeline execution failed: ${error.message}`);
  }
})();
