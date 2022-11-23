import * as InternalUseCases from '@app/domains/internal/use-cases';

import type { Middleware } from 'koa';

interface Route {
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  path: string;
  handler: Middleware;
}

export const liveness: Route = {
  method: 'get',
  path: '/.well-known/liveness',
  handler: async (ctx) => {
    if (InternalUseCases.isSystemAlive()) {
      ctx.status = 200;
      ctx.body = 'Alive';
    } else {
      ctx.status = 500;
      ctx.body = 'Not Alive. Check logs';
    }
  },
};

export const readiness: Route = {
  method: 'get',
  path: '/.well-known/readiness',
  handler: async (ctx) => {
    if (InternalUseCases.isSystemAlive()) {
      ctx.status = 200;
      ctx.body = 'Ready';
    } else {
      ctx.status = 500;
      ctx.body = 'Not Ready. Check logs';
    }
  },
};
