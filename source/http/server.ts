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
  .use(Middleware.authenticate(Env.jwtSecret))
  .use(Router.routes());

export default server;
