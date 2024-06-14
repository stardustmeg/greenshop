import type { User } from '@/shared/types/user';

import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { BUTTON_TEXT, BUTTON_TEXT_KEYS } from '@/shared/constants/buttons.ts';
import SVG_DETAILS from '@/shared/constants/svg.ts';
import TOOLTIP_TEXT from '@/shared/constants/tooltip.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import createSVGUse from '@/shared/utils/createSVGUse.ts';
import getCurrentLanguage from '@/shared/utils/getCurrentLanguage.ts';
import { userInfoDateOfBirth, userInfoEmail, userInfoLastName, userInfoName } from '@/shared/utils/messageTemplates.ts';
import observeCurrentLanguage from '@/shared/utils/observeCurrentLanguage.ts';

import styles from './userInfoView.module.scss';

class UserInfoView {
  private birthDate: HTMLSpanElement;

  private currentUser: User;

  private editInfoButton: ButtonModel;

  private editPasswordButton: ButtonModel;

  private email: HTMLSpanElement;

  private firstName: HTMLSpanElement;

  private lastName: HTMLSpanElement;

  private logo: HTMLDivElement;

  private userInfoWrapper: HTMLDivElement;

  constructor(currentUser: User) {
    this.currentUser = currentUser;
    this.firstName = this.createFirstName();
    this.lastName = this.createLastName();
    this.email = this.createEmail();
    this.birthDate = this.createBirthDate();
    this.logo = this.createLogo();
    this.editInfoButton = this.createEditInfoButton();
    this.editPasswordButton = this.createEditPasswordButton();
    this.userInfoWrapper = this.createUserInfoWrapper();
  }

  private createBirthDate(): HTMLSpanElement {
    this.birthDate = createBaseElement({
      cssClasses: [styles.info],
      innerContent: userInfoDateOfBirth(this.currentUser.birthDate),
      tag: 'span',
    });

    observeStore(selectCurrentLanguage, () => {
      this.birthDate.textContent = userInfoDateOfBirth(this.currentUser.birthDate);
    });
    return this.birthDate;
  }

  private createEditInfoButton(): ButtonModel {
    this.editInfoButton = new ButtonModel({
      classes: [styles.editInfoButton],
      text: BUTTON_TEXT[getCurrentLanguage()].EDIT_INFO,
    });

    observeCurrentLanguage(this.editInfoButton.getHTML(), BUTTON_TEXT, BUTTON_TEXT_KEYS.EDIT_INFO);

    return this.editInfoButton;
  }

  private createEditPasswordButton(): ButtonModel {
    this.editPasswordButton = new ButtonModel({
      classes: [styles.editPasswordButton],
      title: TOOLTIP_TEXT[getCurrentLanguage()].EDIT_PASSWORD,
    });

    this.editPasswordButton.getHTML().append(this.logo);

    observeStore(selectCurrentLanguage, () => {
      this.editPasswordButton.getHTML().title = TOOLTIP_TEXT[getCurrentLanguage()].EDIT_PASSWORD;
    });

    return this.editPasswordButton;
  }

  private createEmail(): HTMLSpanElement {
    this.email = createBaseElement({
      cssClasses: [styles.info],
      innerContent: userInfoEmail(this.currentUser.email),
      tag: 'span',
    });

    observeStore(selectCurrentLanguage, () => {
      this.email.textContent = userInfoEmail(this.currentUser.email);
    });
    return this.email;
  }

  private createFirstName(): HTMLSpanElement {
    this.firstName = createBaseElement({
      cssClasses: [styles.info],
      innerContent: userInfoName(this.currentUser.firstName),
      tag: 'span',
    });

    observeStore(selectCurrentLanguage, () => {
      this.firstName.textContent = userInfoName(this.currentUser.firstName);
    });
    return this.firstName;
  }

  private createLastName(): HTMLSpanElement {
    this.lastName = createBaseElement({
      cssClasses: [styles.info],
      innerContent: userInfoLastName(this.currentUser.lastName),
      tag: 'span',
    });

    observeStore(selectCurrentLanguage, () => {
      this.lastName.textContent = userInfoLastName(this.currentUser.lastName);
    });
    return this.lastName;
  }

  private createLogo(): HTMLDivElement {
    this.logo = createBaseElement({ cssClasses: [styles.keyLogo], tag: 'div' });
    const svg = document.createElementNS(SVG_DETAILS.SVG_URL, 'svg');
    svg.append(createSVGUse(SVG_DETAILS.KEY));
    this.logo.append(svg);
    return this.logo;
  }

  private createUserInfoWrapper(): HTMLDivElement {
    this.userInfoWrapper = createBaseElement({
      cssClasses: [styles.userInfoWrapper, styles.hidden],
      tag: 'div',
    });
    this.userInfoWrapper.append(
      this.firstName,
      this.lastName,
      this.email,
      this.birthDate,
      this.editInfoButton.getHTML(),
      this.editPasswordButton.getHTML(),
    );
    return this.userInfoWrapper;
  }

  public getBirthDate(): HTMLSpanElement {
    return this.birthDate;
  }

  public getEditInfoButton(): ButtonModel {
    return this.editInfoButton;
  }

  public getEditPasswordButton(): ButtonModel {
    return this.editPasswordButton;
  }

  public getEmail(): HTMLSpanElement {
    return this.email;
  }

  public getFirstName(): HTMLSpanElement {
    return this.firstName;
  }

  public getHTML(): HTMLDivElement {
    return this.userInfoWrapper;
  }

  public getLastName(): HTMLSpanElement {
    return this.lastName;
  }

  public hide(): void {
    this.userInfoWrapper.classList.add(styles.hidden);
  }

  public show(): void {
    this.userInfoWrapper.classList.remove(styles.hidden);
  }
}
export default UserInfoView;
