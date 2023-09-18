import {BotService} from './src/bot';
import {GitZipperService} from './src/core';
import {DBService} from './src/db';

(async function main(): Promise<void> {
  GitZipperService({db: await DBService(), bot: await BotService()});
})();
