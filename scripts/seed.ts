import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../lib/db/schema';
import { promises as fs } from 'fs';
import path from 'path';

const main = async () => {
  try {
    const db = drizzle(new Database('local.db'), { schema });
    console.log('Seeding database...');

    const srdPath = path.join(process.cwd(), 'data', 'cepheus-engine-srd.json');
    const robsPath = path.join(process.cwd(), 'data', 'robs-cepheus-ruleset.json');

    const srdData = JSON.parse(await fs.readFile(srdPath, 'utf-8'));
    const robsData = JSON.parse(await fs.readFile(robsPath, 'utf-8'));

    await db
      .insert(schema.rulesets)
      .values([
        {
          name: 'Cepheus Engine SRD',
          data: srdData,
        },
        {
          name: "Rob's Cepheus Ruleset",
          data: robsData,
        },
      ])
      .onConflictDoNothing();

    console.log('Database seeded successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

main();
