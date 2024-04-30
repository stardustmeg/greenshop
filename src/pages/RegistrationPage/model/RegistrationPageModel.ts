import type { PageInterface } from '@/shared/types/interfaces.ts';

import EventMediatorModel from '@/shared/EventMediator/model/EventMediatorModel.ts';
import { MEDIATOR_EVENTS, PAGES_IDS } from '@/shared/constants/enums.ts';

import RegistrationPageView from '../view/RegistrationPageView.ts';

class RegistrationPageModel implements PageInterface {
  private eventMediator = EventMediatorModel.getInstance();

  private view: RegistrationPageView;

  constructor(parent: HTMLDivElement) {
    this.view = new RegistrationPageView(parent);
    this.subscribeToEventMediator();
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
