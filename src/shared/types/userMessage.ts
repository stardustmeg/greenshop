import type { MessageStatusType, ServerMessageKeysType } from '../constants/messages';

interface UserMessage {
  key?: ServerMessageKeysType;
  message?: string;
  status: MessageStatusType;
}

export default UserMessage;
