import Log from '@shared/log';
import Server from '@app/http/server';
import * as Env from '@shared/env';
import Manager from '@shared/process-manager';

const main = () => {
  Log.trace('Starting');

  const instance = Server.listen(Env.port, () => {
    Log.trace('Started');
  });

  Manager.onClose(async () => {
    await new Promise((res) => {
      instance.close(res);
    });
  });
};

process
  .on('SIGTERM', Manager.shutdown)
  .on('uncaughtException', Manager.error)
  .on('unhandledRejection', Manager.error);

main();
