import type { Page } from '@/shared/types/page.ts';

import RouterModel from '@/app/Router/model/RouterModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setCurrentPage } from '@/shared/Store/actions.ts';
import observeStore, { selectIsUserLoggedIn } from '@/shared/Store/observer.ts';
import { PAGE_LINK_TEXT, PAGE_LINK_TEXT_KEY } from '@/shared/constants/links.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';
import observeCurrentLanguage from '@/shared/utils/observeCurrentLanguage.ts';
import RegisterFormModel from '@/widgets/RegistrationForm/model/RegistrationFormModel.ts';

import RegistrationPageView from '../view/RegistrationPageView.ts';

class RegistrationPageModel implements Page {
  private registerForm = new RegisterFormModel();

  private view: RegistrationPageView;

  constructor(parent: HTMLDivElement) {
    this.view = new RegistrationPageView(parent);
    this.init();
  }

  private init(): void {
    getStore().dispatch(setCurrentPage(PAGE_ID.REGISTRATION_PAGE));
    this.view.getAuthWrapper().append(this.registerForm.getHTML());
    this.registerForm.getFirstInputField().getView().getInput().getHTML().focus();
    observeStore(selectIsUserLoggedIn, () => RouterModel.getInstance().navigateTo(PAGE_ID.MAIN_PAGE));
    this.setLoginLinkHandler();
  }

  private loginLinkHandler(event: Event): void {
    event.preventDefault();
    RouterModel.getInstance().navigateTo(PAGE_ID.LOGIN_PAGE);
  }

  private setLoginLinkHandler(): void {
    const toLoginPageWrapper = this.view.getToLoginPageWrapper();
    const loginLink = this.view.getLoginLink().getHTML();
    const loginLinkCopy = loginLink.cloneNode(true);

    observeCurrentLanguage(loginLinkCopy, PAGE_LINK_TEXT, PAGE_LINK_TEXT_KEY.LOGIN);

    loginLink.addEventListener('click', (event) => this.loginLinkHandler(event));
    loginLinkCopy.addEventListener('click', (event) => this.loginLinkHandler(event));
    toLoginPageWrapper.append(loginLinkCopy);
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default RegistrationPageModel;
