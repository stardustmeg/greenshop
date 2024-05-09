import type RouterModel from '@/app/Router/model/RouterModel.ts';
import type { Page } from '@/shared/types/common.ts';
import type { User } from '@/shared/types/user.ts';

import serverMessageModel from '@/shared/ServerMessage/model/ServerMessageModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setCurrentPage } from '@/shared/Store/actions.ts';
import observeStore, { selectCurrentUser } from '@/shared/Store/observer.ts';
import { MESSAGE_STATUS, SERVER_MESSAGE } from '@/shared/constants/messages.ts';
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

  private async checkAuthUser(): Promise<User | null> {
    const { currentUser } = getStore().getState();

    if (currentUser) {
      try {
        await this.router.navigateTo(PAGE_ID.MAIN_PAGE);
        return currentUser;
      } catch (error) {
        serverMessageModel.showServerMessage(SERVER_MESSAGE.BAD_REQUEST, MESSAGE_STATUS.ERROR);
        return null;
      }
    }

    return null;
  }

  private init(): boolean {
    getStore().dispatch(setCurrentPage(PAGE_ID.LOGIN_PAGE));
    this.checkAuthUser()
      .then(() => {})
      .catch(() => {});
    this.view.getAuthWrapper().append(this.loginForm.getHTML());
    this.loginForm.getFirstInputField().getView().getInput().getHTML().focus();
    this.setRegisterLinkHandler();
    observeStore(selectCurrentUser, () => this.checkAuthUser());
    return true;
  }

  private async registerLinkHandler(event: Event): Promise<void> {
    event.preventDefault();
    try {
      await this.router.navigateTo(PAGE_ID.REGISTRATION_PAGE);
    } catch (error) {
      serverMessageModel.showServerMessage(SERVER_MESSAGE.BAD_REQUEST, MESSAGE_STATUS.ERROR);
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
