import {Telegraf} from 'telegraf';

import {Bot, TgRequestHandler} from './core/interface';

const bot = new Telegraf(process.env.BOT_TOKEN || '');
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

let tgRequestHandler: TgRequestHandler;

export async function BotService(): Promise<Bot> {
  bot.on('text', ctx => {
    const [login, project] = ctx.message.text.split(' ');
    tgRequestHandler({
      chatId: ctx.chat.id,
      gitId: {
        login,
        project,
      },
    });
  });
  await bot.launch();

  return {
    onRequest,
    sendFileToChatByUrl,
  };
}

function onRequest(handler: TgRequestHandler): void {
  tgRequestHandler = handler;
}

async function sendFileToChatByUrl(
  chatId: number,
  url: string,
  message: string
): Promise<void> {
  await bot.telegram.sendDocument(chatId, {filename: 'master.zip', url});
  await bot.telegram.sendMessage(chatId, message);
}
