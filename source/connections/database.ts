import { Pool } from 'pg';

import * as Env from '@shared/env';

const pool = new Pool({
  user: Env.db.user,
  password: Env.db.password,
  host: Env.db.host,
  port: Env.db.port,
  database: Env.db.database,
});

export default pool;
