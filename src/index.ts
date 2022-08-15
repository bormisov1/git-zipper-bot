import {BotService} from './bot';
import {GitZipperService} from './core';
import {DBService} from './db';

(async function main(): Promise<void> {
  GitZipperService(await DBService(), await BotService());
})();
