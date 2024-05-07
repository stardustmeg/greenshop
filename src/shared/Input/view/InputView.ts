import type { InputParams } from '@/shared/types/form';

import createBaseElement from '@/shared/utils/createBaseElement.ts';

class InputView {
  private input: HTMLInputElement;

  constructor(attrs: InputParams) {
    this.input = this.createHTML(attrs);
  }

  private createHTML(attrs: InputParams): HTMLInputElement {
    this.input = createBaseElement({
      attributes: {
        autocomplete: attrs.autocomplete,
        id: attrs.id,
        lang: attrs.lang || '',
        placeholder: attrs.placeholder || '',
        type: attrs.type,
      },
      tag: 'input',
    });

    return this.input;
  }

  public getHTML(): HTMLInputElement {
    return this.input;
  }
}

export default InputView;
