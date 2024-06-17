import type { AboutData } from '@/shared/types/validation/aboutData.ts';

import AboutShortCardModel from '@/entities/AboutShortCard/model/AboutShortCardModel.ts';

import AboutFullCardView from '../view/AboutFullCardView.ts';

class AboutFullCardModel extends AboutShortCardModel {
  protected view: AboutFullCardView;

  constructor(params: AboutData) {
    super(params);
    this.view = new AboutFullCardView(params);
  }
}

export default AboutFullCardModel;
