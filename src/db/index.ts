import {FindOptionsWhere} from 'typeorm';

import {DB, TgRequestDTO} from '../core/interface';

import {AppDataSource} from './data-source';

export async function DBService(): Promise<DB> {
  await AppDataSource.initialize();

  return {
    findTgRequest,
    insertTgRequest,
  };
}

async function findTgRequest(
  where: FindOptionsWhere<TgRequestDTO>
): Promise<TgRequestDTO | null> {
  return await AppDataSource.manager.findOneBy<TgRequestDTO>(
    'tg_request',
    where
  );
}

async function insertTgRequest(dto: TgRequestDTO): Promise<Date> {
  const {
    generatedMaps: [{createdAt}],
  } = await AppDataSource.manager.insert('tg_request', dto);
  return createdAt;
}
