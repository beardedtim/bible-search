import Koa from 'koa';
import * as Env from '@shared/env';

import * as Middleware from './middleware';
import Router from './router';

const server = new Koa();

server
  .use(
    Middleware.reqLogger({
      skip: (ctx) =>
        ctx.url === '/.well-known/liveness' ||
        ctx.url === '/.well-known/readiness',
    })
  )
  .use(Middleware.globalErrorHandler())
  /**
   * This needs to go before the mapping so that
   * it logs only the http errors
   */
  .use(Middleware.errorLogger('HTTP Error'))
  .use(Middleware.mapDomainErrorsToHTTP())
  /**
   * This needs to go after mapping so that it
   * logs only domain errors
   */
  .use(Middleware.errorLogger('Domain Error'))
  .use(Middleware.authenticate(Env.jwtSecret))
  .use(Router.routes());

export default server;
