import Router from '@koa/router';
import Log from '@shared/log';
import * as Routes from './routes';

const router = new Router();

for (const [routeName, routeConfig] of Object.entries(Routes)) {
  Log.trace({ routeName, routeConfig }, `Add ${routeName}`);
  const middlewareList = Array.isArray(routeConfig.handler)
    ? routeConfig.handler
    : [routeConfig.handler];

  router[routeConfig.method](routeConfig.path, ...middlewareList);
}

export default router;
