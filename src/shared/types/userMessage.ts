import type { MessageStatusType, ServerMessageKeyType } from '../constants/messages';

interface UserMessage {
  key?: ServerMessageKeyType;
  message?: string;
  status: MessageStatusType;
}

export default UserMessage;
