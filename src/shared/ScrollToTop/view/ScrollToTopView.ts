import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { SCROLL_TO_TOP_THRESHOLD } from '@/shared/constants/common.ts';
import SVG_DETAILS from '@/shared/constants/svg.ts';
import TOOLTIP_TEXT from '@/shared/constants/tooltip.ts';
import createSVGUse from '@/shared/utils/createSVGUse.ts';
import getCurrentLanguage from '@/shared/utils/getCurrentLanguage.ts';

import styles from './scrollToTopView.module.scss';

class ScrollToTopView {
  private button: ButtonModel;

  constructor() {
    this.button = this.createButton();
  }

  private createButton(): ButtonModel {
    this.button = new ButtonModel({
      classes: [styles.scrollToTopButton],
      title: TOOLTIP_TEXT[getCurrentLanguage()].SCROLL_TO_TOP,
    });

    const svg = document.createElementNS(SVG_DETAILS.SVG_URL, 'svg');
    svg.append(createSVGUse(SVG_DETAILS.ARROW_UP));
    this.button.getHTML().append(svg);

    observeStore(selectCurrentLanguage, () => {
      this.button.getHTML().title = TOOLTIP_TEXT[getCurrentLanguage()].SCROLL_TO_TOP;
    });

    return this.button;
  }

  public getHTML(): HTMLButtonElement {
    return this.button.getHTML();
  }

  public toggleVisibility(): void {
    this.button.getHTML().classList.toggle(styles.hidden, window.scrollY <= SCROLL_TO_TOP_THRESHOLD);
  }
}

export default ScrollToTopView;
