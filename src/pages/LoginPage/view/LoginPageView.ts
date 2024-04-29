import { TAG_NAMES } from '@/shared/constants/enums.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import LOGIN_PAGE_STYLES from './loginPageView.module.scss';

class LoginPageView {
  private page: HTMLDivElement;

  private parent: HTMLDivElement;

  constructor(parent: HTMLDivElement) {
    this.parent = parent;
    this.page = this.createHTML();
  }

  private createHTML(): HTMLDivElement {
    this.page = createBaseElement({
      cssClasses: [LOGIN_PAGE_STYLES.loginPage],
      tag: TAG_NAMES.DIV,
    });

    this.parent.append(this.page);

    return this.page;
  }

  public getHTML(): HTMLDivElement {
    return this.page;
  }

  public hide(): boolean {
    this.page.classList.add(LOGIN_PAGE_STYLES.loginPage_hidden);
    return true;
  }

  public show(): boolean {
    this.page.classList.remove(LOGIN_PAGE_STYLES.loginPage_hidden);
    return true;
  }
}
export default LoginPageView;
