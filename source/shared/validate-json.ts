import Enjoi from 'enjoi';
import type { ValidationError } from 'joi';

export interface ReturnValue<T> {
  error?: ValidationError;
  value: T;
}

const validateJSONSchema = (schema: any) => {
  const validator = Enjoi.schema(schema);

  return <T = any>(valueToCheck: any) =>
    validator.validate(valueToCheck) as ReturnValue<T>;
};

export default validateJSONSchema;
