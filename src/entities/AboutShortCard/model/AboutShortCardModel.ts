import type AboutFullCardModel from '@/entities/AboutFullCard/model/AboutFullCardModel.ts';
import type { AboutData } from '@/shared/types/validation/aboutData.ts';

import RouterModel from '@/app/Router/model/RouterModel.ts';
import modal from '@/shared/Modal/model/ModalModel.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';
import { aboutUsPathWithID } from '@/shared/utils/buildPathname.ts';

import AboutShortCardView from '../view/AboutShortCardView.ts';

class AboutShortCardModel {
  private fullCard: AboutFullCardModel | null = null;

  protected params: AboutData;

  protected view: AboutShortCardView;

  constructor(params: AboutData) {
    this.params = params;
    this.view = new AboutShortCardView(params);
    this.init();
  }

  private cardHandler(): void {
    RouterModel.getInstance().navigateTo(aboutUsPathWithID(this.params.github.name));
    if (this.fullCard) {
      modal.setContent(this.fullCard.getHTML());
      modal.show(() => RouterModel.getInstance().navigateTo(PAGE_ID.ABOUT_US_PAGE));
      modal.getView().getModalContent().scrollTo(0, 0);
    }
  }

  private init(): void {
    this.getHTML().addEventListener('click', this.cardHandler.bind(this));
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }

  public openFullCard(): void {
    const id = RouterModel.getPageID();

    if (id === this.params.github.name) {
      this.cardHandler();
    }
  }

  public setFullCard(fullCard: AboutFullCardModel): void {
    this.fullCard = fullCard;
  }
}

export default AboutShortCardModel;
