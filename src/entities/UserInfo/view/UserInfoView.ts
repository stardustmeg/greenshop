import type { User } from '@/shared/types/user';

import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import getStore from '@/shared/Store/Store.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { BUTTON_TEXT, BUTTON_TEXT_KEYS } from '@/shared/constants/buttons.ts';
import SVG_DETAILS from '@/shared/constants/svg.ts';
import TOOLTIP_TEXT from '@/shared/constants/tooltip.ts';
import clearOutElement from '@/shared/utils/clearOutElement.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import createSVGUse from '@/shared/utils/createSVGUse.ts';
import { userInfoDateOfBirth, userInfoEmail, userInfoLastName, userInfoName } from '@/shared/utils/messageTemplates.ts';
import observeCurrentLanguage from '@/shared/utils/observeCurrentLanguage.ts';

import styles from './userInfoView.module.scss';

class UserInfoView {
  private currentUser: User;

  private editInfoButton: ButtonModel;

  private editPasswordButton: ButtonModel;

  private logo: HTMLDivElement;

  private userInfoWrapper: HTMLDivElement;

  constructor(currentUser: User) {
    this.currentUser = currentUser;
    this.logo = this.createLogo();
    this.editPasswordButton = this.createEditPasswordButton();
    this.userInfoWrapper = this.createUserInfoWrapper();
    this.editInfoButton = this.createEditInfoButton();
    this.showUserInfo();

    observeStore(selectCurrentLanguage, () => {
      clearOutElement(this.userInfoWrapper);
      this.userInfoWrapper.append(this.createEditPasswordButton().getHTML());
      this.showUserInfo();
    });
  }

  private createEditInfoButton(): ButtonModel {
    this.editInfoButton = new ButtonModel({
      classes: [styles.editInfoButton],
      text: BUTTON_TEXT[getStore().getState().currentLanguage].EDIT_INFO,
    });

    observeCurrentLanguage(this.editInfoButton.getHTML(), BUTTON_TEXT, BUTTON_TEXT_KEYS.EDIT_INFO);

    return this.editInfoButton;
  }

  private createEditPasswordButton(): ButtonModel {
    this.editPasswordButton = new ButtonModel({
      classes: [styles.editPasswordButton],
      title: TOOLTIP_TEXT[getStore().getState().currentLanguage].EDIT_PASSWORD,
    });

    this.editPasswordButton.getHTML().append(this.logo);
    return this.editPasswordButton;
  }

  private createLogo(): HTMLDivElement {
    this.logo = createBaseElement({ cssClasses: [styles.keyLogo], tag: 'div' });
    const svg = document.createElementNS(SVG_DETAILS.SVG_URL, 'svg');
    svg.append(createSVGUse(SVG_DETAILS.KEY));
    this.logo.append(svg);
    return this.logo;
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
    this.userInfoWrapper.append(this.editPasswordButton.getHTML());
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

    return true;
  }

  public getEditInfoButton(): ButtonModel {
    return this.editInfoButton;
  }

  public getEditPasswordButton(): ButtonModel {
    return this.editPasswordButton;
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
