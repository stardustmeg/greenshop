import type { ButtonAttributesInterface } from '@/shared/types/interfaces.ts';

import { IS_DISABLED } from '@/shared/constants/enums.ts';

import ButtonView from '../view/ButtonView.ts';

class ButtonModel {
  private view: ButtonView;

  constructor(params: ButtonAttributesInterface) {
    this.view = new ButtonView(params);
  }

  public getHTML(): HTMLButtonElement {
    return this.view.getHTML();
  }

  public setDisabled(): boolean {
    this.view.getHTML().disabled = IS_DISABLED.DISABLED;
    return this.view.getHTML().disabled;
  }

  public setEnabled(): boolean {
    this.view.getHTML().disabled = IS_DISABLED.ENABLED;
    return this.view.getHTML().disabled;
  }
}

export default ButtonModel;
