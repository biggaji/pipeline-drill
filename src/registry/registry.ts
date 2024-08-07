/**
 * Imports steps functions from all over and define a single registry object to export and use
 */

import * as UserActionTasks from '../tasks/base.js';

interface StepRegistry {
  [key: string]: TaskFunction;
}

const stepRegistry: StepRegistry = {
  'Greet User': UserActionTasks.greetUser,
  'Fetch Todo': UserActionTasks.fetchTodoById,
  'Say Bye': UserActionTasks.sayByeToUser,
  'Print Info': UserActionTasks.printInfo,
};

export type TaskFunction = (params: any) => Promise<any>;
export default stepRegistry;
