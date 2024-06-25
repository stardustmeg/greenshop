import type { LinkAttributes } from '@/shared/types/link.ts';

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
      tag: 'a',
    });

    return this.link;
  }

  public getHTML(): HTMLAnchorElement {
    return this.link;
  }

  public setDisabled(): boolean {
    this.link.classList.add(styles.disabled);
    return true;
  }

  public setEnabled(): boolean {
    this.link.classList.remove(styles.disabled);
    return true;
  }
}

export default LinkView;
