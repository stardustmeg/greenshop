import serverMessageModel from '../ServerMessage/model/ServerMessageModel.ts';
import getStore from '../Store/Store.ts';
import { MESSAGE_STATUS, SERVER_MESSAGE } from '../constants/messages.ts';

const showBadRequestMessage = (): boolean =>
  serverMessageModel.showServerMessage(
    SERVER_MESSAGE[getStore().getState().currentLanguage].BAD_REQUEST,
    MESSAGE_STATUS.ERROR,
  );

export default showBadRequestMessage;
