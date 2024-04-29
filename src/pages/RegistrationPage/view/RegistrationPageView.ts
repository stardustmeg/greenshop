import { TAG_NAMES } from '@/shared/constants/enums.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import REGISTRATION_PAGE_STYLES from './registrationPageView.module.scss';

class RegistrationPageView {
  private page: HTMLDivElement;

  private parent: HTMLDivElement;

  constructor(parent: HTMLDivElement) {
    this.parent = parent;
    this.page = this.createHTML();
  }

  private createHTML(): HTMLDivElement {
    this.page = createBaseElement({
      cssClasses: [REGISTRATION_PAGE_STYLES.registrationPage],
      tag: TAG_NAMES.DIV,
    });

    this.parent.append(this.page);

    return this.page;
  }

  public getHTML(): HTMLDivElement {
    return this.page;
  }

  public hide(): boolean {
    this.page.classList.add(REGISTRATION_PAGE_STYLES.registrationPage_hidden);
    return true;
  }

  public show(): boolean {
    this.page.classList.remove(REGISTRATION_PAGE_STYLES.registrationPage_hidden);
    return true;
  }
}
export default RegistrationPageView;
