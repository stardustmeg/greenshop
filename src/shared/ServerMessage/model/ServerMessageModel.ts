import type { MessageStatusType, ServerMessageKeysType } from '@/shared/constants/messages.ts';

import ServerMessageView from '../view/ServerMessageView.ts';

class ServerMessageModel {
  private view: ServerMessageView = new ServerMessageView();

  public showServerMessage(key: ServerMessageKeysType, status: MessageStatusType, message?: string): boolean {
    return this.view.setServerMessage(key, status, message);
  }
}

const serverMessageModel = new ServerMessageModel();

export default serverMessageModel;
