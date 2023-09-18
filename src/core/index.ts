import fs from 'fs';
import stream from 'node:stream';
import {PassThrough} from 'stream';

import fetch from 'node-fetch';
import {MoreThan} from 'typeorm';

import {Bot, DB, TgRequest} from './interface';

let db: DB, bot: Bot;

export function GitZipperService(services: {db: DB; bot: Bot}): void {
  bot = services.bot || bot;
  db = services.db || db;
  bot.onRequest(handleTgRequest);
}

const handleTgRequest = async ({chatId, gitId}: TgRequest): Promise<void> => {
  try {
    // now (in ms) - 7 days * 24 hours * ...
    // const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    // const weekFreshTgRequest = await db.findTgRequest({
    //   login: gitId.login,
    //   project: gitId.project,
    //   isFresh: true,
    //   createdAt: MoreThan(new Date(weekAgo)),
    // });
    // const insertDate = await db.insertTgRequest({
    //   ...gitId,
    //   telegramId: chatId,
    //   isFresh: !weekFreshTgRequest,
    // });
    // const gotCached = weekFreshTgRequest !== null;
    const gotCached = false;
    // const zipLoadDate = gotCached ? weekFreshTgRequest.createdAt : insertDate;
    const zipLoadDate = new Date();
    const zipLoadDateFormatted = zipLoadDate
      .toLocaleDateString()
      .replaceAll('/', '-');
    const zipFilePath = `${gitId.login}-${gitId.project}-${zipLoadDateFormatted}.zip`;
    const zipInTunnel = new PassThrough();
    if (!gotCached) {
      zipInTunnel.pipe(fs.createWriteStream(zipFilePath));
    }
    streamZippedGitToWritable(
      zipInTunnel,
      zipFilePath,
      gotCached,
      `https://github.com/${gitId.login}/${gitId.project}/zipball/master`
    );
    const chatDocument = await bot.getWritableChatDocument(chatId, zipFilePath);
    zipInTunnel.pipe(chatDocument);
    await bot.sendMessageToChat(chatId, zipFilePath);
  } catch (e) {
    console.log(e);
  }
};

const streamZippedGitToWritable = async (
  targetStream: stream.Writable,
  zipFilePath: string,
  gotCached: boolean,
  zipDownloadUrl?: string
): Promise<void> => {
  console.log({
    zipDownloadUrl,
    zipFilePath,
    gotCached,
  });
  let zipStream: NodeJS.ReadableStream;
  if (gotCached) {
    zipStream = fs.createReadStream(zipFilePath);
  } else if (zipDownloadUrl) {
    zipStream = (await fetch(zipDownloadUrl)).body;
  } else {
    throw new Error(
      'Got no cached zip locally and no zip download url is passed'
    );
  }
  return new Promise((resolve, reject) => {
    zipStream.on('data', chunk => {
      targetStream.write(chunk);
    });
    zipStream.on('end', () => {
      targetStream.destroy();
      resolve();
    });
    zipStream.on('error', reject);
  });
};
