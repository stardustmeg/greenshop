import type { InputFieldParams, InputParams, LabelParams } from '@/shared/types/form';

import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import InputModel from '@/shared/Input/model/InputModel.ts';
import { INPUT_TYPE } from '@/shared/constants/forms.ts';
import SVG_DETAILS from '@/shared/constants/svg.ts';
import TAG_NAME from '@/shared/constants/tags.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import createSVGUse from '@/shared/utils/createSVGUse.ts';

class InputFieldView {
  private errorField: HTMLSpanElement | null = null;

  private input: InputModel;

  private inputField: HTMLLabelElement | InputModel;

  private label: HTMLLabelElement | null = null;

  private showPasswordButton: ButtonModel;

  constructor(params: InputFieldParams) {
    this.input = this.createInput(params.inputParams);
    this.showPasswordButton = this.createShowPasswordButton();
    this.inputField = this.createHTML(params);
  }

  private createErrorField(): HTMLSpanElement {
    this.errorField = createBaseElement({
      tag: TAG_NAME.SPAN,
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

    if (this.getInput().getHTML().type === INPUT_TYPE.PASSWORD) {
      this.label?.append(this.showPasswordButton.getHTML());
    }

    return this.inputField;
  }

  private createInput(inputParams: InputParams): InputModel {
    this.input = new InputModel(inputParams);
    return this.input;
  }

  private createLabel(labelParams: LabelParams): HTMLLabelElement {
    const { for: htmlFor, text } = labelParams;
    this.label = createBaseElement({
      attributes: {
        for: htmlFor,
      },
      innerContent: text || '',
      tag: TAG_NAME.LABEL,
    });

    return this.label;
  }

  private createShowPasswordButton(): ButtonModel {
    this.showPasswordButton = new ButtonModel({});
    this.switchPasswordButtonSVG(INPUT_TYPE.PASSWORD);
    return this.showPasswordButton;
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

  public getShowPasswordButton(): ButtonModel {
    return this.showPasswordButton;
  }

  public getValue(): string {
    if (this.inputField instanceof InputModel) {
      return this.inputField.getValue();
    }
    return this.input.getValue();
  }

  public switchPasswordButtonSVG(type: string): SVGSVGElement {
    const svg = document.createElementNS(SVG_DETAILS.SVG_URL, TAG_NAME.SVG);
    this.showPasswordButton.getHTML().innerHTML = '';
    svg.append(createSVGUse(type === INPUT_TYPE.PASSWORD ? SVG_DETAILS.CLOSE_EYE : SVG_DETAILS.OPEN_EYE));
    this.showPasswordButton.getHTML().append(svg);
    return svg;
  }
}

export default InputFieldView;
