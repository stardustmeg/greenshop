import type { ServerMessageKeysType } from '../constants/messages.ts';

import serverMessageModel from '../ServerMessage/model/ServerMessageModel.ts';
import { MESSAGE_STATUS, SERVER_MESSAGE_KEYS } from '../constants/messages.ts';

const showErrorMessage = (error?: unknown, messageKey?: ServerMessageKeysType): boolean => {
  if (error instanceof Error) {
    return serverMessageModel.showServerMessage(SERVER_MESSAGE_KEYS.BAD_REQUEST, MESSAGE_STATUS.ERROR, error.message);
  }

  if (messageKey) {
    return serverMessageModel.showServerMessage(messageKey, MESSAGE_STATUS.ERROR);
  }

  return serverMessageModel.showServerMessage(SERVER_MESSAGE_KEYS.BAD_REQUEST, MESSAGE_STATUS.ERROR);
};

export default showErrorMessage;
