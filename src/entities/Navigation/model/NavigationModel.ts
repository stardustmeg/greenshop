import type RouterModel from '@/app/Router/model/RouterModel';

import getStore from '@/shared/Store/Store.ts';
import observeStore, { selectCurrentPage, selectIsUserLoggedIn } from '@/shared/Store/observer.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';
import showErrorMessage from '@/shared/utils/userMessage.ts';

import NavigationView from '../view/NavigationView.ts';

class NavigationModel {
  private router: RouterModel;

  private view = new NavigationView();

  constructor(router: RouterModel) {
    this.router = router;
    this.init();
  }

  private checkCurrentUser(): boolean {
    const { currentUser } = getStore().getState();
    const navigationLinks = this.view.getNavigationLinks();
    if (!currentUser) {
      navigationLinks.get(PAGE_ID.LOGIN_PAGE)?.setEnabled();
    } else {
      navigationLinks.get(PAGE_ID.LOGIN_PAGE)?.setDisabled();
    }
    return true;
  }

  private init(): boolean {
    this.setNavigationLinksHandlers();
    this.switchLinksState();
    this.observeState();
    return true;
  }

  private observeState(): boolean {
    observeStore(selectIsUserLoggedIn, () => this.checkCurrentUser());
    observeStore(selectCurrentPage, () => this.switchLinksState());
    return true;
  }

  private setNavigationLinksHandlers(): boolean {
    const navigationLinks = this.view.getNavigationLinks();
    navigationLinks.forEach((link, route) => {
      link.getHTML().addEventListener('click', async (event) => {
        event.preventDefault();
        try {
          await this.router.navigateTo(route);
        } catch {
          showErrorMessage();
        }
      });
    });

    return true;
  }

  private switchLinksState(): boolean {
    const { currentPage } = getStore().getState();
    const currentPath = currentPage === '' ? PAGE_ID.MAIN_PAGE : currentPage;
    const navigationLinks = this.view.getNavigationLinks();
    const currentLink = navigationLinks.get(String(currentPath));
    navigationLinks.forEach((link) => link.setEnabled());
    this.checkCurrentUser();
    currentLink?.setDisabled();
    this.view.switchActiveLink(String(currentPath));

    return true;
  }

  public getHTML(): HTMLElement {
    return this.view.getHTML();
  }
}

export default NavigationModel;
