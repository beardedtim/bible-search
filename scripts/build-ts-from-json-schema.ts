import { compile, JSONSchema } from 'json-schema-to-typescript';
import glob from 'glob';
import fs from 'fs/promises';
import path from 'path';
import * as recast from 'recast';
import { TypescriptParser } from 'typescript-parser';
const templateDir = path.resolve(__dirname, '..', 'templates');
const validatorTemplate = fs.readFile(`${templateDir}/validator.ts`);

glob('./source/domains/**/schemas.json', async (err, matches) => {
  for (const match of matches) {
    /**
     * First let's get the file and parse it
     */
    const { $defs = {}, ...configs } = JSON.parse(
      await fs.readFile(match, 'utf8')
    );

    /**
     * Then for each of our configs let's create
     * a schema for it
     */
    let finalStr = '';
    for (const [key, config] of Object.entries(
      configs as Record<string, JSONSchema>
    )) {
      console.log('Building %s', key);
      const configWithDefs = Object.assign({}, config, { $defs });

      finalStr += await compile(configWithDefs, config.title!, {
        bannerComment: '',
      });
    }

    console.log(finalStr);

    const tsParser = new TypescriptParser();
    const parsed = await tsParser.parseSource(finalStr);
    console.dir(parsed);
    // go through the parsed file and remove any duplicates
    const seen = new Set();
    // [start, end] index to remove
    const toRemove = [];
    for (const dec of parsed.declarations) {
      const name = dec.name;

      if (seen.has(name)) {
        toRemove.push([dec.start!, dec.end!]);
      } else {
        seen.add(name);
      }
    }

    const finalSplit: any[] = finalStr.split('');
    for (const [start, end] of toRemove) {
      for (let i = start; i < end; i++) {
        finalSplit[i] = undefined;
      }
    }

    const finalDecs = finalSplit.filter(Boolean).join('');

    const split = match.split('/');

    split.pop();

    const dirPath = split.join('/');

    await Promise.all([
      /**
       * Write out the schema definitions
       */
      await fs.writeFile(`${dirPath}/schema.d.ts`, finalDecs),
      /**
       * Write out the validators
       */
      await fs.writeFile(`${dirPath}/validate.ts`, await validatorTemplate),
    ]);
  }
});
