import type RouterModel from '@/app/Router/model/RouterModel.ts';
import type { Page } from '@/shared/types/common.ts';

import getStore from '@/shared/Store/Store.ts';
import { setCurrentPage } from '@/shared/Store/actions.ts';
import observeStore, { selectIsUserLoggedIn } from '@/shared/Store/observer.ts';
import { PAGE_ID, PAGE_LINK_TEXT, PAGE_LINK_TEXT_KEYS } from '@/shared/constants/pages.ts';
import observeCurrentLanguage from '@/shared/utils/observeCurrentLanguage.ts';
import showErrorMessage from '@/shared/utils/userMessage.ts';
import LoginFormModel from '@/widgets/LoginForm/model/LoginFormModel.ts';

import LoginPageView from '../view/LoginPageView.ts';

class LoginPageModel implements Page {
  private loginForm = new LoginFormModel();

  private router: RouterModel;

  private view: LoginPageView;

  constructor(parent: HTMLDivElement, router: RouterModel) {
    this.router = router;
    this.view = new LoginPageView(parent);
    this.init();
  }

  private async checkAuthUser(): Promise<boolean | null> {
    const { isUserLoggedIn } = getStore().getState();

    if (isUserLoggedIn) {
      try {
        await this.router.navigateTo(PAGE_ID.MAIN_PAGE);
        return isUserLoggedIn;
      } catch (error) {
        showErrorMessage();
        return null;
      }
    }

    return null;
  }

  private init(): boolean {
    getStore().dispatch(setCurrentPage(PAGE_ID.LOGIN_PAGE));
    this.checkAuthUser().catch(() => showErrorMessage());
    this.view.getAuthWrapper().append(this.loginForm.getHTML());
    this.loginForm.getFirstInputField().getView().getInput().getHTML().focus();
    this.setRegisterLinkHandler();
    observeStore(selectIsUserLoggedIn, () => this.checkAuthUser());
    return true;
  }

  private async registerLinkHandler(event: Event): Promise<void> {
    event.preventDefault();
    try {
      await this.router.navigateTo(PAGE_ID.REGISTRATION_PAGE);
    } catch (error) {
      showErrorMessage();
    }
  }

  private setRegisterLinkHandler(): void {
    const toRegisterPageWrapper = this.view.getToRegisterPageWrapper();
    const registerLink = this.view.getRegisterLink().getHTML();
    const registerLinkCopy = registerLink.cloneNode(true);

    observeCurrentLanguage(registerLinkCopy, PAGE_LINK_TEXT, PAGE_LINK_TEXT_KEYS.REGISTRATION);

    registerLink.addEventListener('click', (event) => this.registerLinkHandler(event));
    registerLinkCopy.addEventListener('click', (event) => this.registerLinkHandler(event));
    toRegisterPageWrapper.append(registerLinkCopy);
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default LoginPageModel;
