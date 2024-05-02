import type RouterModel from '@/app/Router/model/RouterModel.ts';
import type { PageInterface } from '@/shared/types/interfaces.ts';

import EventMediatorModel from '@/shared/EventMediator/model/EventMediatorModel.ts';
import { EVENT_NAMES, MEDIATOR_EVENTS, PAGES_IDS } from '@/shared/constants/enums.ts';
import LoginFormModel from '@/widgets/LoginForm/model/LoginFormModel.ts';

import LoginPageView from '../view/LoginPageView.ts';

class LoginPageModel implements PageInterface {
  private eventMediator = EventMediatorModel.getInstance();

  private loginForm = new LoginFormModel();

  private router: RouterModel;

  private view: LoginPageView;

  constructor(parent: HTMLDivElement, router: RouterModel) {
    this.router = router;
    this.view = new LoginPageView(parent);
    this.init();
  }

  private init(): boolean {
    this.subscribeToEventMediator();
    this.view.getAuthWrapper().append(this.loginForm.getHTML());
    this.registerLinkHandler();
    return true;
  }

  private registerLinkHandler(): void {
    const registerLink = this.view.getRegisterLink();

    registerLink.addEventListener(EVENT_NAMES.CLICK, (event) => {
      event.preventDefault();
      this.router.navigateTo(PAGES_IDS.REGISTRATION_PAGE);
    });
  }

  private subscribeToEventMediator(): void {
    this.eventMediator.subscribe(MEDIATOR_EVENTS.CHANGE_PAGE, (route) => this.switchPageVisibility(route));
  }

  private switchPageVisibility(route: unknown): boolean {
    if (route === PAGES_IDS.LOGIN_PAGE) {
      this.view.show();
      this.loginForm.getFirstInputField().getView().getInput().getHTML().focus();
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
