import Pino from 'pino';
import uuid from '@shared/uuid';
import * as Env from '@shared/env';

import type { Logger } from 'pino';

const log: Logger = Pino({
  level: Env.logLevel,
  name: Env.serviceName,
  serializers: Pino.stdSerializers,
  mixin: () => ({
    _id: uuid(),
  }),
});

export default log;
