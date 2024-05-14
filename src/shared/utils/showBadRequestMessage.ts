import serverMessageModel from '../ServerMessage/model/ServerMessageModel.ts';
import { MESSAGE_STATUS, SERVER_MESSAGE_KEYS } from '../constants/messages.ts';

const showBadRequestMessage = (): boolean =>
  serverMessageModel.showServerMessage(SERVER_MESSAGE_KEYS.BAD_REQUEST, MESSAGE_STATUS.ERROR);

export default showBadRequestMessage;
