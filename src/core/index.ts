import fs from 'fs';
import stream from 'node:stream';
import {PassThrough} from 'stream';

import fetch from 'node-fetch';

import {Bot, DB, GitId, TgRequest} from './interface';

export function GitZipperService(db: DB, bot: Bot): void {
  bot.onRequest(async ({chatId, gitId}: TgRequest): Promise<void> => {
    try {
      const zipLoadDate = await db.insertAndFindTgRequest({chatId, gitId});
      const fsWriteStream = fs.createWriteStream('zip.zip');
      const zipTunnel = new PassThrough();
      zipTunnel.pipe(fsWriteStream);
      streamZippedGitToWritable(gitId, zipTunnel);
      bot.sendFileToChatByUrl(
        chatId,
        gitIdToUrl(gitId),
        zipLoadDate.toLocaleString()
      );
    } catch (e) {
      console.log(e);
    }
  });
}

const gitIdToUrl = ({login, project}: GitId): string =>
  `https://github.com/${login}/${project}/zipball/master`;

const streamZippedGitToWritable = async (
  gitId: GitId,
  targetStream: stream.Writable
): Promise<void[]> => {
  const response = await fetch(gitIdToUrl(gitId));
  return new Promise((resolve, reject) => {
    response.body.on('data', chunk => {
      targetStream.write(chunk);
    });
    response.body.on('error', reject);
    targetStream.on('finish', resolve);
  });
};
