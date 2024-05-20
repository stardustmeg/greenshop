import type { User } from '@/shared/types/user.ts';

import PasswordEditModel from '@/features/PasswordEdit/model/PasswordEditModel.ts';
import modal from '@/shared/Modal/model/ModalModel.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';

import UserInfoView from '../view/UserInfoView.ts';

class UserInfoModel {
  private view: UserInfoView;

  constructor(user: User) {
    this.view = new UserInfoView(user);
    this.view.show();
    this.setEditInfoButtonHandler();
    this.setEditPasswordButtonHandler();

    observeStore(selectCurrentLanguage, () => {
      this.setEditInfoButtonHandler();
      this.setEditPasswordButtonHandler();
    });
  }

  private setEditInfoButtonHandler(): boolean {
    const editInfoButton = this.view.getEditInfoButton();
    editInfoButton.getHTML().addEventListener('click', (event) => {
      event.preventDefault();
    });
    return true;
  }

  private setEditPasswordButtonHandler(): boolean {
    const editPasswordButton = this.view.getEditPasswordButton();
    const passwordEdit = new PasswordEditModel();
    editPasswordButton.getHTML().addEventListener('click', (event) => {
      event.preventDefault();
      modal.show();
      modal.setContent(passwordEdit.getHTML());
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
