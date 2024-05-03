import type { ButtonAttributes } from '@/shared/types/button.ts';

import { TAG_NAMES } from '@/shared/constants/enums.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

class ButtonView {
  private button: HTMLButtonElement;

  constructor(params: ButtonAttributes) {
    this.button = this.createHTML(params);
  }

  private createHTML(params: ButtonAttributes): HTMLButtonElement {
    this.button = createBaseElement({
      attributes: params.attrs,
      cssClasses: params.classes,
      innerContent: params.text,
      tag: TAG_NAMES.BUTTON,
    });

    if (params.action) {
      this.button.addEventListener(params.action.key, params.action.value);
    }

    return this.button;
  }

  public getHTML(): HTMLButtonElement {
    return this.button;
  }
}

export default ButtonView;
