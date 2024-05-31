import serverMessageModel from '../ServerMessage/model/ServerMessageModel.ts';
import { MESSAGE_STATUS, SERVER_MESSAGE_KEYS } from '../constants/messages.ts';

const showErrorMessage = (param: unknown): boolean => {
  if (param instanceof Error) {
    return serverMessageModel.showServerMessage(SERVER_MESSAGE_KEYS.BAD_REQUEST, MESSAGE_STATUS.ERROR, param.message);
  }

  if (typeof param === 'string' && param in SERVER_MESSAGE_KEYS) {
    return serverMessageModel.showServerMessage(param, MESSAGE_STATUS.ERROR);
  }

  return serverMessageModel.showServerMessage(SERVER_MESSAGE_KEYS.BAD_REQUEST, MESSAGE_STATUS.ERROR);
};

export default showErrorMessage;
