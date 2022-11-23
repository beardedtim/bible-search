import Log from '@shared/log';
import Server from '@app/http/server';
import * as Env from '@shared/env';

const main = () => {
  Log.trace('Starting');

  Server.listen(Env.port, () => {
    Log.trace('Started');
  });
};

main();
