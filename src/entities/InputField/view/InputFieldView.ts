import type { InputFieldParams, InputParams, LabelParams } from '@/shared/types/form';

import InputModel from '@/shared/Input/model/InputModel.ts';
import getStore from '@/shared/Store/Store.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import styles from './inputFieldView.module.scss';

class InputFieldView {
  private errorField: HTMLSpanElement | null = null;

  private input: InputModel;

  private inputField: HTMLLabelElement | InputModel;

  private label: HTMLLabelElement | null = null;

  private labelText: HTMLSpanElement | null = null;

  constructor(params: InputFieldParams) {
    this.input = this.createInput(params.inputParams);
    this.inputField = this.createHTML(params);
  }

  private createErrorField(): HTMLSpanElement {
    this.errorField = createBaseElement({
      cssClasses: [styles.error],
      tag: 'span',
    });
    return this.errorField;
  }

  private createHTML(params: InputFieldParams): HTMLLabelElement | InputModel {
    const { labelParams } = params;
    if (labelParams) {
      this.inputField = this.createLabel(labelParams);
      this.errorField = this.createErrorField();
      this.labelText = this.createLabelText(labelParams);
      this.label?.append(this.labelText, this.input.getHTML(), this.errorField);
    } else {
      this.inputField = this.input;
    }

    return this.inputField;
  }

  private createInput(inputParams: InputParams): InputModel {
    this.input = new InputModel(inputParams);
    return this.input;
  }

  private createLabel(labelParams: LabelParams): HTMLLabelElement {
    const { for: htmlFor } = labelParams;

    this.label = createBaseElement({
      attributes: {
        for: htmlFor ?? '',
      },
      tag: 'label',
    });

    return this.label;
  }

  private createLabelText(labelParams: LabelParams): HTMLSpanElement {
    const labelText = createBaseElement({
      cssClasses: [styles.labelText],
      tag: 'span',
    });

    const updateLabelText = (): void => {
      if (labelParams?.text) {
        labelText.textContent = labelParams.text[getStore().getState().currentLanguage];
      }
    };

    updateLabelText();

    observeStore(selectCurrentLanguage, updateLabelText);
    return labelText;
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
