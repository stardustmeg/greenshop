import type { LinkAttributes } from '@/shared/types/link.ts';

import TAG_NAME from '@/shared/constants/tags.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import styles from './linkView.module.scss';

class LinkView {
  private link: HTMLAnchorElement;

  constructor(params: LinkAttributes) {
    this.link = this.createHTML(params);
  }

  private createHTML(params: LinkAttributes): HTMLAnchorElement {
    this.link = createBaseElement({
      attributes: params.attrs,
      cssClasses: params.classes,
      innerContent: params.text,
      tag: TAG_NAME.A,
    });

    return this.link;
  }

  public getHTML(): HTMLAnchorElement {
    return this.link;
  }

  public toggleDisabled(): boolean {
    this.link.classList.toggle(styles.disabled);
    return true;
  }
}

export default LinkView;
