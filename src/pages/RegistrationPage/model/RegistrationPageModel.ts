import type RouterModel from '@/app/Router/model/RouterModel.ts';
import type { Page } from '@/shared/types/common.ts';

import EventMediatorModel from '@/shared/EventMediator/model/EventMediatorModel.ts';
import MEDIATOR_EVENT from '@/shared/constants/events.ts';
import { PAGE_ID, PAGE_LINK_TEXT, PAGE_LINK_TEXT_KEYS } from '@/shared/constants/pages.ts';
import observeCurrentLanguage from '@/shared/utils/observeCurrentLanguage.ts';
import RegisterFormModel from '@/widgets/RegistrationForm/model/RegistrationFormModel.ts';

import RegistrationPageView from '../view/RegistrationPageView.ts';

class RegistrationPageModel implements Page {
  private eventMediator = EventMediatorModel.getInstance();

  private registerForm = new RegisterFormModel();

  private router: RouterModel;

  private view: RegistrationPageView;

  constructor(parent: HTMLDivElement, router: RouterModel) {
    this.view = new RegistrationPageView(parent);
    this.router = router;
    this.init();
  }

  private init(): void {
    this.view.getAuthWrapper().append(this.registerForm.getHTML());
    this.subscribeToEventMediator();
    this.setLoginLinkHandler();
  }

  private loginLinkHandler(event: Event): void {
    event.preventDefault();
    this.router.navigateTo(PAGE_ID.LOGIN_PAGE);
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

  private subscribeToEventMediator(): void {
    this.eventMediator.subscribe(MEDIATOR_EVENT.CHANGE_PAGE, (route) => this.switchPageVisibility(route));
  }

  private switchPageVisibility(route: unknown): boolean {
    if (route === PAGE_ID.REGISTRATION_PAGE) {
      this.view.show();
      this.registerForm.getFirstInputField().getView().getInput().getHTML().focus();
    } else {
      this.view.hide();
      return false;
    }
    return true;
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default RegistrationPageModel;
