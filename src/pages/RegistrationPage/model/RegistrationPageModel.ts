import type RouterModel from '@/app/Router/model/RouterModel.ts';
import type { PageInterface } from '@/shared/types/interfaces.ts';

import EventMediatorModel from '@/shared/EventMediator/model/EventMediatorModel.ts';
import { EVENT_NAMES, MEDIATOR_EVENTS, PAGES_IDS } from '@/shared/constants/enums.ts';
import RegisterFormModel from '@/widgets/RegistrationForm/model/RegistrationFormModel.ts';

import RegistrationPageView from '../view/RegistrationPageView.ts';

class RegistrationPageModel implements PageInterface {
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
    this.loginLinkHandler();
  }

  private loginLinkHandler(): void {
    const loginLink = this.view.getLoginLink();

    loginLink.addEventListener(EVENT_NAMES.CLICK, (event) => {
      event.preventDefault();
      this.router.navigateTo(PAGES_IDS.LOGIN_PAGE);
    });
  }

  private subscribeToEventMediator(): void {
    this.eventMediator.subscribe(MEDIATOR_EVENTS.CHANGE_PAGE, (route) => this.switchPageVisibility(route));
  }

  private switchPageVisibility(route: unknown): boolean {
    if (route === PAGES_IDS.REGISTRATION_PAGE) {
      this.view.show();
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
