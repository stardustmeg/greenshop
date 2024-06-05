import type { CooperationData } from '@/shared/types/validation/cooperationData.ts';

import getStore from '@/shared/Store/Store.ts';
import { setCurrentPage } from '@/shared/Store/actions.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';
import isCooperationData from '@/shared/types/validation/cooperationData.ts';
import getCooperationData from '@/shared/utils/getCooperationData.ts';
import showErrorMessage from '@/shared/utils/userMessage.ts';

import CooperationPageView from '../view/CooperationPageView.ts';

class CooperationPageModel {
  private view: CooperationPageView;

  constructor(parent: HTMLDivElement) {
    this.view = new CooperationPageView(parent);
    this.init();
  }

  private init(): void {
    getCooperationData()
      .then((data) => {
        if (isCooperationData(data)) {
          this.view.drawCooperationInfo(data);
          this.observeState(data);
        }
      })
      .catch(showErrorMessage);
    getStore().dispatch(setCurrentPage(PAGE_ID.COOPERATION_PAGE));
  }

  private observeState(data: CooperationData[]): void {
    observeStore(selectCurrentLanguage, () => {
      this.view.redrawCooperationInfo(data);
    });
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default CooperationPageModel;
