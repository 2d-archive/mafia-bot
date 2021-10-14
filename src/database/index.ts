cd import { join } from 'path';
import { createConnection } from 'typeorm';
import { Guild } from './Guild';

export function create() {
  return createConnection({
    type: 'sqlite',
    database: join(process.cwd(), 'mafia.sql'),
      entities: [Guild],
    synchronize: true
  });
}