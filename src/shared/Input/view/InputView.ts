import type { InputParams } from '@/shared/types/form';

import { AUTOCOMPLETE_OPTION } from '@/shared/constants/common.ts';
import { INPUT_TYPE } from '@/shared/constants/forms.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

class InputView {
  private input: HTMLInputElement;

  constructor(attrs: InputParams) {
    this.input = this.createHTML(attrs);
  }

  private createHTML(attrs: InputParams): HTMLInputElement {
    this.input = createBaseElement({
      attributes: {
        autocomplete: attrs.autocomplete ?? AUTOCOMPLETE_OPTION.ON,
        id: attrs.id || '',
        lang: attrs.lang || '',
        max: String(attrs.max || 0),
        min: String(attrs.min || 0),
        placeholder: attrs.placeholder || '',
        step: String(attrs.step || 1),
        type: attrs.type ?? INPUT_TYPE.TEXT,
        value: attrs.value || '',
      },
      tag: 'input',
    });
    this.setDataAttributes(attrs.data ?? {});

    return this.input;
  }

  private setDataAttributes(dataAttributes: Record<string, string>): void {
    Object.entries(dataAttributes).forEach(([key, value]) => {
      this.input.setAttribute(`data-${key}`, value);
    });
  }

  public getHTML(): HTMLInputElement {
    return this.input;
  }
}

export default InputView;
