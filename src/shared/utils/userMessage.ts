import serverMessageModel from '../ServerMessage/model/ServerMessageModel.ts';
import { MESSAGE_STATUS, SERVER_MESSAGE_KEYS } from '../constants/messages.ts';

export const showErrorMessage = (param: unknown): boolean => {
  if (param instanceof Error) {
    return serverMessageModel.showServerMessage({
      key: SERVER_MESSAGE_KEYS.BAD_REQUEST,
      message: param.message,
      status: MESSAGE_STATUS.ERROR,
    });
  }

  if (typeof param === 'string' && param in SERVER_MESSAGE_KEYS) {
    return serverMessageModel.showServerMessage({
      key: param,
      status: MESSAGE_STATUS.ERROR,
    });
  }

  if (typeof param === 'string') {
    return serverMessageModel.showServerMessage({
      key: SERVER_MESSAGE_KEYS.BAD_REQUEST,
      message: param,
      status: MESSAGE_STATUS.ERROR,
    });
  }

  return serverMessageModel.showServerMessage({
    key: SERVER_MESSAGE_KEYS.BAD_REQUEST,
    status: MESSAGE_STATUS.ERROR,
  });
};

export const showSuccessMessage = (param: unknown): boolean => {
  if (typeof param === 'string' && param in SERVER_MESSAGE_KEYS) {
    return serverMessageModel.showServerMessage({
      key: param,
      status: MESSAGE_STATUS.SUCCESS,
    });
  }

  if (typeof param === 'string') {
    return serverMessageModel.showServerMessage({
      message: param,
      status: MESSAGE_STATUS.SUCCESS,
    });
  }

  return serverMessageModel.showServerMessage({
    status: MESSAGE_STATUS.SUCCESS,
  });
};
