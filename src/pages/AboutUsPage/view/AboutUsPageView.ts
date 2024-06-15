import LinkModel from '@/shared/Link/model/LinkModel.ts';
import getStore from '@/shared/Store/Store.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { LINK_DETAILS } from '@/shared/constants/links.ts';
import { PAGE_DESCRIPTION } from '@/shared/constants/pages.ts';
import SVG_DETAILS from '@/shared/constants/svg.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import createSVGUse from '@/shared/utils/createSVGUse.ts';

import styles from './aboutUsPageView.module.scss';

class AboutUsPageView {
  private cardsList: HTMLUListElement;

  private page: HTMLDivElement;

  private parent: HTMLDivElement;

  constructor(parent: HTMLDivElement) {
    this.parent = parent;
    this.parent.innerHTML = '';
    this.cardsList = this.createCardsList();
    this.page = this.createHTML();
    window.scrollTo(0, 0);
  }

  private createCardsList(): HTMLUListElement {
    this.cardsList = createBaseElement({
      cssClasses: [styles.cardsList],
      tag: 'ul',
    });
    return this.cardsList;
  }

  private createHTML(): HTMLDivElement {
    this.page = createBaseElement({
      cssClasses: [styles.aboutUsPage],
      tag: 'div',
    });

    this.page.append(this.createTitle(), this.cardsList, this.createRSSLogo().getHTML());
    this.parent.append(this.page);

    return this.page;
  }

  private createRSSLogo(): LinkModel {
    const logo = new LinkModel({
      attrs: {
        href: 'https://rs.school',
        target: LINK_DETAILS.BLANK,
      },
      classes: [styles.logo],
    });

    const svg = document.createElementNS(SVG_DETAILS.SVG_URL, 'svg');
    svg.append(createSVGUse(SVG_DETAILS.RSS_LOGO));
    logo.getHTML().append(svg);
    return logo;
  }

  private createTitle(): HTMLHeadingElement {
    const title = createBaseElement({
      cssClasses: [styles.title],
      innerContent: PAGE_DESCRIPTION[getStore().getState().currentLanguage].ABOUT,
      tag: 'h1',
    });

    observeStore(selectCurrentLanguage, () => {
      title.innerText = PAGE_DESCRIPTION[getStore().getState().currentLanguage].ABOUT;
    });
    return title;
  }

  public getCardsList(): HTMLUListElement {
    return this.cardsList;
  }

  public getHTML(): HTMLDivElement {
    return this.page;
  }
}
export default AboutUsPageView;
