/**
 * Imports steps functions from all over and define a single registry object to export and use
 */

type TaskFunction = (params: any) => Promise<any>;

interface StepRegistry {
  [key: string]: TaskFunction;
}

const stepRegistry: StepRegistry = {
  'Upload Profile Image': async (): Promise<any> => {
    return await '';
  },
  // 'Verify Gov ID': verificationTasks.verifyGovId,
  // 'Update Profile': verificationTasks.updateUserProfile,
  // 'Deactivate Account': deactivationTasks.deactivateAccount,
  // 'Notify User': deactivationTasks.notifyUser,
};

export default stepRegistry;
