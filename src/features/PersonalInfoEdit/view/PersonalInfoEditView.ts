import createBaseElement from '@/shared/utils/createBaseElement.ts';

import styles from './personalInfoEditView.module.scss';

class PersonalInfoEditView {
  private view: HTMLDivElement;

  constructor() {
    this.view = this.createHTML();
  }

  private createHTML(): HTMLDivElement {
    this.view = createBaseElement({
      cssClasses: [styles.style],
      tag: 'div',
    });
    return this.view;
  }

  public getHTML(): HTMLDivElement {
    return this.view;
  }
}

export default PersonalInfoEditView;
