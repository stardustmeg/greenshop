import { TAG_NAMES } from '@/shared/constants/enums.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

class InputView {
  private input: HTMLInputElement;

  constructor(attrs: Record<string, string>) {
    this.input = this.createHTML(attrs);
  }

  private createHTML(attrs: Record<string, string>): HTMLInputElement {
    this.input = createBaseElement({
      attributes: attrs,
      tag: TAG_NAMES.INPUT,
    });

    return this.input;
  }

  public getHTML(): HTMLInputElement {
    return this.input;
  }
}

export default InputView;
