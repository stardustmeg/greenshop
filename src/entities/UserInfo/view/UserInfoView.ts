import type { User } from '@/shared/types/user';

import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import getStore from '@/shared/Store/Store.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { BUTTON_TEXT, BUTTON_TEXT_KEYS } from '@/shared/constants/buttons.ts';
import clearOutElement from '@/shared/utils/clearOutElement.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import { userInfoDateOfBirth, userInfoEmail, userInfoLastName, userInfoName } from '@/shared/utils/messageTemplates.ts';
import observeCurrentLanguage from '@/shared/utils/observeCurrentLanguage.ts';

import styles from './userInfoView.module.scss';

class UserInfoView {
  private currentUser: User;

  private editInfoButton: ButtonModel;

  private userInfoWrapper: HTMLDivElement;

  constructor(currentUser: User) {
    this.currentUser = currentUser;
    this.userInfoWrapper = this.createUserInfoWrapper();
    this.editInfoButton = this.createEditInfoButton();
    this.showUserInfo();
  }

  private createEditInfoButton(): ButtonModel {
    this.editInfoButton = new ButtonModel({
      classes: [styles.editInfoButton],
      text: BUTTON_TEXT[getStore().getState().currentLanguage].EDIT_INFO,
    });

    observeCurrentLanguage(this.editInfoButton.getHTML(), BUTTON_TEXT, BUTTON_TEXT_KEYS.EDIT_INFO);

    return this.editInfoButton;
  }

  private createUserElement(
    text: string,
    tag: keyof HTMLElementTagNameMap = 'li',
    classes: string[] = [styles.info],
  ): HTMLElement {
    return createBaseElement({
      cssClasses: classes,
      innerContent: text,
      tag,
    });
  }

  private createUserInfoWrapper(): HTMLDivElement {
    this.userInfoWrapper = createBaseElement({
      cssClasses: [styles.userInfoWrapper, styles.hidden],
      tag: 'div',
    });
    return this.userInfoWrapper;
  }

  private showUserInfo(): boolean {
    const { birthDate, email, firstName, lastName } = this.currentUser;

    const nameWrapper = document.createDocumentFragment();
    nameWrapper.append(
      this.createUserElement(userInfoName(firstName)),
      this.createUserElement(userInfoLastName(lastName)),
      this.editInfoButton.getHTML(),
    );

    const userInfoWrapper = document.createDocumentFragment();
    userInfoWrapper.append(
      nameWrapper,
      this.createUserElement(userInfoDateOfBirth(birthDate)),
      this.createUserElement(userInfoEmail(email)),
    );
    this.userInfoWrapper.append(userInfoWrapper);

    observeStore(selectCurrentLanguage, () => {
      clearOutElement(this.userInfoWrapper);
      this.showUserInfo();
    });

    return true;
  }

  public getEditInfoButton(): ButtonModel {
    return this.editInfoButton;
  }

  public getHTML(): HTMLDivElement {
    return this.userInfoWrapper;
  }

  public hide(): void {
    this.userInfoWrapper.classList.add(styles.hidden);
  }

  public show(): void {
    this.userInfoWrapper.classList.remove(styles.hidden);
  }
}
export default UserInfoView;
