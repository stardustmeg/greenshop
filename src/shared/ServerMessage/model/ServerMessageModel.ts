import type UserMessage from '@/shared/types/userMessage.ts';

import ServerMessageView from '../view/ServerMessageView.ts';

class ServerMessageModel {
  private view: ServerMessageView = new ServerMessageView();

  public showServerMessage(params: UserMessage): boolean {
    if (!params?.status) {
      return false;
    }

    return this.view.setServerMessage(params.status, params.key, params.message);
  }
}

const serverMessageModel = new ServerMessageModel();

export default serverMessageModel;
