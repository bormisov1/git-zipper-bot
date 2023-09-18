import {Writable} from 'stream';

import {FindOptionsWhere} from 'typeorm';

interface GitId {
  login: string;
  project: string;
}

interface TgRequestDTO {
  id: number;
  login: string;
  project: string;
  isFresh: boolean;
  createdAt: Date;
  telegramId: number;
}

interface InsertTgRequestDTO {
  login: string;
  project: string;
  isFresh: boolean;
  telegramId: number;
}

// Current DB interface
interface DB {
  findTgRequest(
    where: FindOptionsWhere<TgRequestDTO>
  ): Promise<TgRequestDTO | null>;
  insertTgRequest(dto: InsertTgRequestDTO): Promise<Date>;
}

type TgRequest = {chatId: number; gitId: GitId};
type TgRequestHandler = (request: TgRequest) => void;
interface Bot {
  onRequest(handle: (request: TgRequest) => void): void;
  getWritableChatDocument(chatId: number, filename: string): Promise<Writable>;
  sendMessageToChat(chatId: number, message: string): Promise<void>;
}

export {
  Bot,
  DB,
  GitId,
  TgRequestDTO,
  InsertTgRequestDTO,
  InsertTgRequestResult,
  TgRequest,
  TgRequestHandler,
};
