import * as DomainErrors from '@shared/errors';

import validators from './validate';
import type { CreateUser } from './schema';

export const create = async (input: unknown) => {
  const { error, value } = validators.create<CreateUser>(input);

  if (error) {
    throw new DomainErrors.BadInput(error.message, error);
  }

  console.log('Created', value);
};
