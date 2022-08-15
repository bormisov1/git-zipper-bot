interface GitId {
  login: string;
  project: string;
}

export interface DB {
  insertAndFindTgRequest(r: TgRequest): Promise<Date>;
  // findHistoryRecords(r: TgRequest): Promise<TgRequestDTO[]>;
  // createHistoryRecord(rec: TgRequestDTO): Promise<void>;
}

type TgRequest = {chatId: number; gitId: GitId};
export type TgRequestHandler = (request: TgRequest) => void;
export interface Bot {
  onRequest(handle: (request: TgRequest) => void): void;
  sendFileToChatByUrl(
    chatId: number,
    url: string,
    message: string
  ): Promise<void>;
}

// interface TgRequestDTO {
//   id: number;
//   login: string;
//   project: string;
//   isFresh: boolean;
//   createdAt: number;
//   telegramId: number;
// }
