import {DataSource} from 'typeorm';

import {TgRequest} from './entity/TgRequest';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'db',
  port: 5432,
  username: 'user',
  password: 'admin',
  database: 'test',
  synchronize: true,
  logging: true,
  entities: [TgRequest],
  subscribers: [],
  migrations: [],
});
