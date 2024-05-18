import type { User } from '@/shared/types/user.ts';

import UserInfoView from '../view/UserInfoView.ts';

class UserInfoModel {
  private view: UserInfoView;

  constructor(user: User) {
    this.view = new UserInfoView(user);
    this.view.show();
    this.setEditInfoButtonHandler();
  }

  private setEditInfoButtonHandler(): boolean {
    const editInfoButton = this.view.getEditInfoButton();
    editInfoButton.getHTML().addEventListener('click', () => {
      // TBD Replace with edit action
    });
    return true;
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }

  public hide(): void {
    this.view.hide();
  }

  public show(): void {
    this.view.show();
  }
}

export default UserInfoModel;
