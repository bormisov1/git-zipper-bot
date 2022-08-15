import {MoreThan} from 'typeorm';

import {DB} from '../core/interface';
import {TgRequest} from '../core/interface';

import {AppDataSource} from './data-source';

// const initSql: string;

export async function DBService(): Promise<DB> {
  await AppDataSource.initialize();

  return {
    insertAndFindTgRequest,
  };
}

async function insertAndFindTgRequest(tgRequest: TgRequest): Promise<Date> {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const freshTgRequest = await AppDataSource.manager.findOneBy('tg_request', {
    ...tgRequest.gitId,
    isFresh: true,
    createdAt: MoreThan(new Date(weekAgo)),
  });
  const {raw} = await AppDataSource.manager.insert('tg_request', {
    ...tgRequest.gitId,
    telegramId: tgRequest.chatId,
    isFresh: !freshTgRequest,
  });
  if (freshTgRequest) return new Date(freshTgRequest.createdAt.toString());
  return raw.createdAt;
}
