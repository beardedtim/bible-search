const processOr = (key: string, fallback: unknown) => {
  if (key in process.env) {
    return process.env[key];
  }

  if (fallback !== undefined) {
    return fallback;
  }

  throw new TypeError(
    `Expected "${key}" to be set in process.env or given a fallback`
  );
};

export const port = processOr('PORT', 5000);
export const logLevel = processOr('LOG_LEVEL', 'trace');
export const serviceName = processOr('SERVICE_NAME', 'UNKNOWN');
