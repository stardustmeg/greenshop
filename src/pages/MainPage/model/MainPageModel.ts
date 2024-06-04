import type { Page } from '@/shared/types/page.ts';

import getStore from '@/shared/Store/Store.ts';
import { setCurrentPage } from '@/shared/Store/actions.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';
import BlogWidgetModel from '@/widgets/Blog/model/BogWidgetModel.ts';

import MainPageView from '../view/MainPageView.ts';

class MainPageModel implements Page {
  private blogWidget: BlogWidgetModel;

  private parent: HTMLDivElement;

  private view: MainPageView;

  constructor(parent: HTMLDivElement) {
    this.parent = parent;
    this.view = new MainPageView(this.parent);
    this.blogWidget = new BlogWidgetModel(this.view.getHTML());
    this.init();
  }

  private init(): void {
    this.getHTML().append(this.blogWidget.getHTML());
    getStore().dispatch(setCurrentPage(PAGE_ID.MAIN_PAGE));
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default MainPageModel;
