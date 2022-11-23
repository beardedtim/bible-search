import * as DomainErrors from '@shared/errors';

import validate from './validate';
import type { User } from './schema';

export const create = async (input: unknown) => {
  const { error, value } = validate<User>(input);

  if (error) {
    throw new DomainErrors.BadInput(error.message, error);
  }

  console.log('Created', value);
};
