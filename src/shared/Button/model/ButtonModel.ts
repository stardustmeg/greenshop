import type { ButtonAttributes } from '@/shared/types/button.ts';

import ButtonView from '../view/ButtonView.ts';

class ButtonModel {
  private view: ButtonView;

  constructor(params: ButtonAttributes) {
    this.view = new ButtonView(params);
  }

  public getHTML(): HTMLButtonElement {
    return this.view.getHTML();
  }

  public setDisabled(): boolean {
    this.view.setDisabled();
    return this.view.getHTML().disabled;
  }

  public setEnabled(): boolean {
    this.view.setEnabled();
    return this.view.getHTML().disabled;
  }
}

export default ButtonModel;
