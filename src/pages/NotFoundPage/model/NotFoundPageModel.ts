import type RouterModel from '@/app/Router/model/RouterModel.ts';
import type { Page } from '@/shared/types/page.ts';

import getStore from '@/shared/Store/Store.ts';
import { setCurrentPage } from '@/shared/Store/actions.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { PAGE_DESCRIPTION, PAGE_ID } from '@/shared/constants/pages.ts';

import NotFoundPageView from '../view/NotFoundPageView.ts';

class NotFoundPageModel implements Page {
  private router: RouterModel | null = null;

  private view: NotFoundPageView;

  constructor(parent: HTMLDivElement, router: RouterModel | null) {
    this.view = new NotFoundPageView(parent);
    this.router = router;
    this.init();
  }

  private createPageDescription(): string {
    const { currentLanguage, currentUser } = getStore().getState();
    const { GREETING } = PAGE_DESCRIPTION[currentLanguage];
    const textDescription = currentUser
      ? `${GREETING}${currentUser.firstName}. ${PAGE_DESCRIPTION[currentLanguage][404]}`
      : PAGE_DESCRIPTION[currentLanguage][404];
    return textDescription;
  }

  private init(): boolean {
    getStore().dispatch(setCurrentPage(PAGE_ID.NOT_FOUND_PAGE));
    this.toMainButtonHandler();
    this.observeStoreLanguage();
    this.view.setPageDescription(this.createPageDescription());
    return true;
  }

  private observeStoreLanguage(): boolean {
    observeStore(selectCurrentLanguage, () => {
      this.view.setPageDescription(this.createPageDescription());
    });
    return true;
  }

  private toMainButtonHandler(): boolean {
    const toMainButton = this.view.getToMainButton().getHTML();
    toMainButton.addEventListener('click', () => this.router?.navigateTo(PAGE_ID.MAIN_PAGE));
    return true;
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default NotFoundPageModel;
