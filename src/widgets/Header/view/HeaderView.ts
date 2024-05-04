import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import LinkModel from '@/shared/Link/model/LinkModel.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';
import SVG_DETAILS from '@/shared/constants/svg.ts';
import TAG_NAME from '@/shared/constants/tags.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import createSVGUse from '@/shared/utils/createSVGUse.ts';

import styles from './headerView.module.scss';

class HeaderView {
  private header: HTMLElement;

  private linkLogo: LinkModel;

  private logoutButton: ButtonModel;

  constructor() {
    this.logoutButton = this.createLogoutButton();
    this.linkLogo = this.createLinkLogo();
    this.header = this.createHTML();
  }

  private createHTML(): HTMLElement {
    this.header = createBaseElement({
      cssClasses: [styles.header],
      tag: TAG_NAME.HEADER,
    });

    this.header.append(this.linkLogo.getHTML(), this.logoutButton.getHTML());
    return this.header;
  }

  private createLinkLogo(): LinkModel {
    this.linkLogo = new LinkModel({
      attrs: {
        href: PAGE_ID.DEFAULT_PAGE,
      },
      classes: [styles.logo],
    });

    const svg = document.createElementNS(SVG_DETAILS.SVG_URL, TAG_NAME.SVG);
    svg.append(createSVGUse(SVG_DETAILS.LOGO));
    this.linkLogo.getHTML().append(svg);
    return this.linkLogo;
  }

  private createLogoutButton(): ButtonModel {
    this.logoutButton = new ButtonModel({
      classes: [styles.logoutButton],
      text: 'Logout',
    });

    return this.logoutButton;
  }

  public getHTML(): HTMLElement {
    return this.header;
  }

  public getLinkLogo(): LinkModel {
    return this.linkLogo;
  }

  public getLogoutButton(): ButtonModel {
    return this.logoutButton;
  }
}

export default HeaderView;
