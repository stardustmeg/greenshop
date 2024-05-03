import type RouterModel from '@/app/Router/model/RouterModel.ts';
import type { Page } from '@/shared/types/common.ts';

import EventMediatorModel from '@/shared/EventMediator/model/EventMediatorModel.ts';
import observeStore, { selectCurrentUser } from '@/shared/Store/observer.ts';
import { MEDIATOR_EVENTS, PAGES_IDS } from '@/shared/constants/enums.ts';

import MainPageView from '../view/MainPageView.ts';

class MainPageModel implements Page {
  private eventMediator = EventMediatorModel.getInstance();

  private router: RouterModel;

  private view: MainPageView;

  constructor(parent: HTMLDivElement, router: RouterModel) {
    this.router = router;
    this.view = new MainPageView(parent);
    this.init();
  }

  private init(): void {
    this.subscribeToEventMediator();
    this.subscribeToStore();
  }

  private subscribeToEventMediator(): void {
    this.eventMediator.subscribe(MEDIATOR_EVENTS.CHANGE_PAGE, (route) => this.switchPageVisibility(route));
  }

  private subscribeToStore(): boolean {
    observeStore(selectCurrentUser, () => {
      this.router.navigateTo(PAGES_IDS.MAIN_PAGE);
    });
    return true;
  }

  private switchPageVisibility(route: unknown): boolean {
    if (route === PAGES_IDS.MAIN_PAGE || route === PAGES_IDS.DEFAULT_PAGE) {
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

export default MainPageModel;
