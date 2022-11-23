import Enjoi from 'enjoi';
import type { ValidationError } from 'joi';

const validateJSONSchema = (schema: any) => {
  const validator = Enjoi.schema(schema);

  return <T = any>(valueToCheck: any) =>
    validator.validate(valueToCheck) as {
      error?: ValidationError;
      value: T;
    };
};

export default validateJSONSchema;
