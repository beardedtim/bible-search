export const isSystemReady = () => true;
export const isSystemAlive = () => true;

export const testJWTAuthentication = (state: { user?: any }) =>
  state.user || { nothing: true };

export const isUserAllowedToPerformAction = (userId: string, action: string) =>
  true;
