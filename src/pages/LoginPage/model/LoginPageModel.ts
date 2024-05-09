import type RouterModel from '@/app/Router/model/RouterModel.ts';
import type { Page } from '@/shared/types/common.ts';
import type { User } from '@/shared/types/user.ts';

import getStore from '@/shared/Store/Store.ts';
import { setCurrentPage } from '@/shared/Store/actions.ts';
import observeStore, { selectCurrentUser } from '@/shared/Store/observer.ts';
import { PAGE_ID, PAGE_LINK_TEXT, PAGE_LINK_TEXT_KEYS } from '@/shared/constants/pages.ts';
import observeCurrentLanguage from '@/shared/utils/observeCurrentLanguage.ts';
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

  private checkAuthUser(): User | null {
    const { currentUser } = getStore().getState();

    if (currentUser) {
      this.router.navigateTo(PAGE_ID.MAIN_PAGE);
      return currentUser;
    }

    return null;
  }

  private init(): boolean {
    getStore().dispatch(setCurrentPage(PAGE_ID.LOGIN_PAGE));
    this.checkAuthUser();
    this.view.getAuthWrapper().append(this.loginForm.getHTML());
    this.loginForm.getFirstInputField().getView().getInput().getHTML().focus();
    this.setRegisterLinkHandler();
    observeStore(selectCurrentUser, () => this.checkAuthUser());
    return true;
  }

  private registerLinkHandler(event: Event): void {
    event.preventDefault();
    this.router.navigateTo(PAGE_ID.REGISTRATION_PAGE);
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
