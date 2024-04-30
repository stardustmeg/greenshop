import type { InputFieldParams, InputParams, LabelParams } from '@/shared/types/interfaces.ts';

import { TAG_NAMES } from '@/shared/constants/enums.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import InputModel from '../../../shared/Input/model/InputModel.ts';

class InputFieldView {
  private errorField: HTMLSpanElement | null = null;

  private input: InputModel;

  private inputField: HTMLLabelElement | InputModel;

  private label: HTMLLabelElement | null = null;

  constructor(params: InputFieldParams) {
    this.input = this.createInput(params.inputParams);
    this.inputField = this.createHTML(params);
  }

  private createErrorField(): HTMLSpanElement {
    this.errorField = createBaseElement({
      tag: TAG_NAMES.SPAN,
    });

    return this.errorField;
  }

  private createHTML(params: InputFieldParams): HTMLLabelElement | InputModel {
    const { labelParams } = params;
    if (labelParams) {
      this.inputField = this.createLabel(labelParams);
      this.errorField = this.createErrorField();
      this.label?.append(this.input.getHTML(), this.errorField);
    } else {
      this.inputField = this.input;
    }

    return this.inputField;
  }

  private createInput(inputParams: InputParams): InputModel {
    const { autocomplete, id, placeholder, type } = inputParams;
    this.input = new InputModel({
      autocomplete,
      id,
      placeholder: placeholder || '',
      type,
    });

    return this.input;
  }

  private createLabel(labelParams: LabelParams): HTMLLabelElement {
    const { for: htmlFor, text } = labelParams;
    this.label = createBaseElement({
      attributes: {
        for: htmlFor,
      },
      innerContent: text || '',
      tag: TAG_NAMES.LABEL,
    });

    return this.label;
  }

  public getErrorField(): HTMLSpanElement | null {
    return this.errorField;
  }

  public getHTML(): HTMLLabelElement | InputModel {
    return this.inputField;
  }

  public getInput(): InputModel {
    return this.input;
  }

  public getValue(): string {
    if (this.inputField instanceof InputModel) {
      return this.inputField.getValue();
    }
    return this.input.getValue();
  }
}

export default InputFieldView;
