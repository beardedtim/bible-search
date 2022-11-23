import Enjoi from 'enjoi';

const validateJSONSchema = (schema: any) => {
  const validator = Enjoi.schema(schema);

  return <T = any>(valueToCheck: any) => {
    const { error, value } = validator.validate(valueToCheck);

    if (error) {
      throw error;
    }

    return value as T;
  };
};

export default validateJSONSchema;
