import type RouterModel from '@/app/Router/model/RouterModel.ts';
import type { Page } from '@/shared/types/common.ts';

import NavigationModel from '@/entities/Navigation/model/NavigationModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setCurrentPage } from '@/shared/Store/actions.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';

import MainPageView from '../view/MainPageView.ts';

class MainPageModel implements Page {
  private navigation: NavigationModel;

  private router: RouterModel;

  private view: MainPageView;

  constructor(parent: HTMLDivElement, router: RouterModel) {
    this.router = router;
    this.view = new MainPageView(parent);
    this.navigation = new NavigationModel(this.router);
    this.init();
  }

  private init(): void {
    this.getHTML().append(this.navigation.getHTML());
    getStore().dispatch(setCurrentPage(PAGE_ID.MAIN_PAGE));
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default MainPageModel;
