import type { InputParams } from '@/shared/types/interfaces.ts';

import { IS_DISABLED } from '@/shared/constants/enums.ts';

import InputView from '../view/InputView.ts';

class InputModel {
  private view: InputView;

  constructor(attrs: InputParams) {
    this.view = new InputView(attrs);
  }

  public clear(): void {
    this.view.getHTML().value = '';
  }

  public getHTML(): HTMLInputElement {
    return this.view.getHTML();
  }

  public getValue(): string {
    return this.view.getHTML().value;
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

export default InputModel;
