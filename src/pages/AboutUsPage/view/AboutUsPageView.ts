import LinkModel from '@/shared/Link/model/LinkModel.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { LINK_DETAIL } from '@/shared/constants/links.ts';
import { PAGE_DESCRIPTION } from '@/shared/constants/pages.ts';
import SVG_DETAIL from '@/shared/constants/svg.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import createSVGUse from '@/shared/utils/createSVGUse.ts';
import getCurrentLanguage from '@/shared/utils/getCurrentLanguage.ts';

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
        target: LINK_DETAIL.BLANK,
      },
      classes: [styles.logo],
    });

    const svg = document.createElementNS(SVG_DETAIL.SVG_URL, 'svg');
    svg.append(createSVGUse(SVG_DETAIL.RSS_LOGO));
    logo.getHTML().append(svg);
    return logo;
  }

  private createTitle(): HTMLHeadingElement {
    const title = createBaseElement({
      cssClasses: [styles.title],
      innerContent: PAGE_DESCRIPTION[getCurrentLanguage()].ABOUT,
      tag: 'h1',
    });

    observeStore(selectCurrentLanguage, () => {
      title.innerText = PAGE_DESCRIPTION[getCurrentLanguage()].ABOUT;
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
