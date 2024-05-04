import type RouterModel from '@/app/Router/model/RouterModel.ts';
import type { Page } from '@/shared/types/common.ts';

import EventMediatorModel from '@/shared/EventMediator/model/EventMediatorModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { EVENT_NAME, MEDIATOR_EVENT } from '@/shared/constants/events.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';
import LoginFormModel from '@/widgets/LoginForm/model/LoginFormModel.ts';

import LoginPageView from '../view/LoginPageView.ts';

class LoginPageModel implements Page {
  private eventMediator = EventMediatorModel.getInstance();

  private loginForm = new LoginFormModel();

  private router: RouterModel;

  private view: LoginPageView;

  constructor(parent: HTMLDivElement, router: RouterModel) {
    this.router = router;
    this.view = new LoginPageView(parent);
    this.init();
  }

  private checkAuthUser(): boolean {
    if (!getStore().getState().currentUser) {
      this.view.show();
      this.loginForm.getFirstInputField().getView().getInput().getHTML().focus();
      return false;
    }
    this.router.navigateTo(PAGE_ID.MAIN_PAGE);
    return true;
  }

  private init(): boolean {
    this.subscribeToEventMediator();
    this.view.getAuthWrapper().append(this.loginForm.getHTML());
    this.setRegisterLinkHandler();
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

    registerLink.addEventListener(EVENT_NAME.CLICK, (event) => this.registerLinkHandler(event));
    registerLinkCopy.addEventListener(EVENT_NAME.CLICK, (event) => this.registerLinkHandler(event));
    toRegisterPageWrapper.append(registerLinkCopy);
  }

  private subscribeToEventMediator(): void {
    this.eventMediator.subscribe(MEDIATOR_EVENT.CHANGE_PAGE, (route) => this.switchPageVisibility(route));
  }

  private switchPageVisibility(route: unknown): boolean {
    if (route === PAGE_ID.LOGIN_PAGE) {
      this.checkAuthUser();
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

export default LoginPageModel;
