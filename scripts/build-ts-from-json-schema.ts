import { compileFromFile } from 'json-schema-to-typescript';
import glob from 'glob';
import fs from 'fs/promises';
import path from 'path';
const templateDir = path.resolve(__dirname, '..', 'templates');
const validatorTemplate = fs.readFile(`${templateDir}/validator.ts`);

glob('./source/domains/**/schema.json', async (err, matches) => {
  for (const match of matches) {
    const split = match.split('/');

    split.pop();

    const dirPath = split.join('/');
    const tsOutput = await compileFromFile(match);

    await Promise.all([
      /**
       * Write out the schema definitions
       */
      await fs.writeFile(`${dirPath}/schema.d.ts`, tsOutput),
      /**
       * Write out the validators
       */
      await fs.writeFile(`${dirPath}/validate.ts`, await validatorTemplate),
    ]);
  }
});
