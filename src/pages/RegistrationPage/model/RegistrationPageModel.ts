import type RouterModel from '@/app/Router/model/RouterModel.ts';
import type { Page } from '@/shared/types/common.ts';

import serverMessageModel from '@/shared/ServerMessage/model/ServerMessageModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setCurrentPage } from '@/shared/Store/actions.ts';
import observeStore, { selectIsUserLoggedIn } from '@/shared/Store/observer.ts';
import { MESSAGE_STATUS, SERVER_MESSAGE } from '@/shared/constants/messages.ts';
import { PAGE_ID, PAGE_LINK_TEXT, PAGE_LINK_TEXT_KEYS } from '@/shared/constants/pages.ts';
import observeCurrentLanguage from '@/shared/utils/observeCurrentLanguage.ts';
import RegisterFormModel from '@/widgets/RegistrationForm/model/RegistrationFormModel.ts';

import RegistrationPageView from '../view/RegistrationPageView.ts';

class RegistrationPageModel implements Page {
  private registerForm = new RegisterFormModel();

  private router: RouterModel;

  private view: RegistrationPageView;

  constructor(parent: HTMLDivElement, router: RouterModel) {
    this.view = new RegistrationPageView(parent);
    this.router = router;
    this.init();
  }

  private init(): void {
    getStore().dispatch(setCurrentPage(PAGE_ID.REGISTRATION_PAGE));
    this.view.getAuthWrapper().append(this.registerForm.getHTML());
    this.registerForm.getFirstInputField().getView().getInput().getHTML().focus();
    observeStore(selectIsUserLoggedIn, () => this.router.navigateTo(PAGE_ID.MAIN_PAGE));
    this.setLoginLinkHandler();
  }

  private async loginLinkHandler(event: Event): Promise<void> {
    event.preventDefault();
    try {
      await this.router.navigateTo(PAGE_ID.LOGIN_PAGE);
    } catch {
      serverMessageModel.showServerMessage(SERVER_MESSAGE.BAD_REQUEST, MESSAGE_STATUS.ERROR);
    }
  }

  private setLoginLinkHandler(): void {
    const toLoginPageWrapper = this.view.getToLoginPageWrapper();
    const loginLink = this.view.getLoginLink().getHTML();
    const loginLinkCopy = loginLink.cloneNode(true);

    observeCurrentLanguage(loginLinkCopy, PAGE_LINK_TEXT, PAGE_LINK_TEXT_KEYS.LOGIN);

    loginLink.addEventListener('click', (event) => this.loginLinkHandler(event));
    loginLinkCopy.addEventListener('click', (event) => this.loginLinkHandler(event));
    toLoginPageWrapper.append(loginLinkCopy);
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default RegistrationPageModel;
