import type { MessageStatusType } from '@/shared/constants/enums.ts';

import ServerMessageView from '../view/ServerMessageView.ts';

class ServerMessageModel {
  private view: ServerMessageView = new ServerMessageView();

  public showServerMessage(message: string, status: MessageStatusType): boolean {
    return this.view.setServerMessage(message, status);
  }
}

const serverMessageModel = new ServerMessageModel();

export default serverMessageModel;
