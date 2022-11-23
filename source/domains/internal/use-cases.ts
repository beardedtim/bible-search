import { Pool } from 'pg';
import Log from '@shared/log';

const log = Log.child({
  domain: 'Internal',
});

export const checkDBIsConnected = (db: Pool) =>
  db
    .query('SELECT NOW()')
    .then(() => true)
    .catch((e) => {
      log.warn({ err: e }, 'DB Not Healthy');

      return false;
    });

export const isSystemReady = (db: Pool) => checkDBIsConnected(db);
export const isSystemAlive = (db: Pool) => checkDBIsConnected(db);

export const testJWTAuthentication = (state: { user?: any }) =>
  state.user || { nothing: true };

export const isUserAllowedToPerformAction = (userId: string, action: string) =>
  true;
