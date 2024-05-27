import type { User } from '@/shared/types/user.ts';

import PasswordEditModel from '@/features/PasswordEdit/model/PasswordEditModel.ts';
import PersonalInfoEditModel from '@/features/PersonalInfoEdit/model/PersonalInfoEditModel.ts';
import getCustomerModel from '@/shared/API/customer/model/CustomerModel.ts';
import EventMediatorModel from '@/shared/EventMediator/model/EventMediatorModel.ts';
import modal from '@/shared/Modal/model/ModalModel.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import MEDIATOR_EVENT from '@/shared/constants/events.ts';
import { userInfoDateOfBirth, userInfoEmail, userInfoLastName, userInfoName } from '@/shared/utils/messageTemplates.ts';
import showErrorMessage from '@/shared/utils/userMessage.ts';

import UserInfoView from '../view/UserInfoView.ts';

class UserInfoModel {
  private view: UserInfoView;

  constructor(user: User) {
    this.view = new UserInfoView(user);
    this.init();
  }

  private init(): void {
    this.view.show();
    this.setEditInfoButtonHandler();
    this.setEditPasswordButtonHandler();

    observeStore(selectCurrentLanguage, () => {
      this.setEditInfoButtonHandler();
      this.setEditPasswordButtonHandler();
    });
    EventMediatorModel.getInstance().subscribe(MEDIATOR_EVENT.REDRAW_USER_INFO, this.redrawUserInfo.bind(this));
  }

  private redrawUserInfo(): void {
    getCustomerModel()
      .getCurrentUser()
      .then((user) => {
        if (user) {
          this.view.getFirstName().textContent = userInfoName(user.firstName);
          this.view.getLastName().textContent = userInfoLastName(user.lastName);
          this.view.getEmail().textContent = userInfoEmail(user.email);
          this.view.getBirthDate().textContent = userInfoDateOfBirth(user.birthDate);
        }
      })
      .catch(showErrorMessage);
  }

  private setEditInfoButtonHandler(): boolean {
    const editInfoButton = this.view.getEditInfoButton();
    editInfoButton.getHTML().addEventListener('click', async () => {
      try {
        const user = await getCustomerModel().getCurrentUser();

        if (user) {
          const personalInfo = new PersonalInfoEditModel(user);
          modal.show();
          modal.setContent(personalInfo.getHTML());
        }
      } catch (error) {
        showErrorMessage(error);
      }
    });
    return true;
  }

  private setEditPasswordButtonHandler(): boolean {
    const editPasswordButton = this.view.getEditPasswordButton();
    const passwordEdit = new PasswordEditModel();
    editPasswordButton.getHTML().addEventListener('click', () => {
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
