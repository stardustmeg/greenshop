import type { ButtonAttributes } from '@/shared/types/button.ts';

import { IS_DISABLED } from '@/shared/constants/buttons.ts';
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
      tag: 'button',
      title: params.title,
    });

    if (params.action) {
      this.button.addEventListener(params.action.key, params.action.value);
    }

    return this.button;
  }

  public getHTML(): HTMLButtonElement {
    return this.button;
  }

  public setDisabled(): boolean {
    this.button.disabled = IS_DISABLED.DISABLED;
    return this.button.disabled;
  }

  public setEnabled(): boolean {
    this.button.disabled = IS_DISABLED.ENABLED;
    return this.button.disabled;
  }
}

export default ButtonView;
