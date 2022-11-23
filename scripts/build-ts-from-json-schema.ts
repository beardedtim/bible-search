import { compileFromFile } from 'json-schema-to-typescript';
import glob from 'glob';
import fs from 'fs/promises';

glob('./source/domains/**/schema.json', async (err, matches) => {
  for (const match of matches) {
    const split = match.split('/');

    split.pop();

    const dirPath = split.join('/');
    const tsOutput = await compileFromFile(match);
    await fs.writeFile(`${dirPath}/schema.d.ts`, tsOutput);
  }
});
