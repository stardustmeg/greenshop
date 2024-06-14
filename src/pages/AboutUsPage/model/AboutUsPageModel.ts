import type { Page } from '@/shared/types/page.ts';

import AboutFullCardModel from '@/entities/AboutFullCard/model/AboutFullCardModel.ts';
import AboutShortCardModel from '@/entities/AboutShortCard/model/AboutShortCardModel.ts';
import modal from '@/shared/Modal/model/ModalModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setCurrentPage } from '@/shared/Store/actions.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';
import isAboutData from '@/shared/types/validation/aboutData.ts';
import getAboutData from '@/shared/utils/getAboutData.ts';
import { showErrorMessage } from '@/shared/utils/userMessage.ts';

import AboutUsPageView from '../view/AboutUsPageView.ts';

class AboutUsPageModel implements Page {
  private view: AboutUsPageView;

  constructor(parent: HTMLDivElement) {
    this.view = new AboutUsPageView(parent);
    this.init();
  }

  private drawCards(): void {
    getAboutData()
      .then((data) => {
        if (isAboutData(data)) {
          data.forEach((card) => {
            const shortCard = new AboutShortCardModel(card);
            shortCard.setFullCard(new AboutFullCardModel(card));
            shortCard.openFullCard();
            this.view.getCardsList().append(shortCard.getHTML());
          });
        }
      })
      .catch(showErrorMessage);
  }

  private init(): void {
    modal.hide();
    getStore().dispatch(setCurrentPage(PAGE_ID.ABOUT_US_PAGE));
    this.drawCards();
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default AboutUsPageModel;
