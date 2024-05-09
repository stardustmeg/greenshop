import InputFieldModel from '@/entities/InputField/model/InputFieldModel.ts';
import InputModel from '@/shared/Input/model/InputModel.ts';
import { FORM_TEXT, INPUT_TYPE } from '@/shared/constants/forms.ts';
import { TITLE_TEXT } from '@/shared/constants/forms/register/constant.ts';
import * as FORM_FIELDS from '@/shared/constants/forms/register/fieldParams.ts';
import * as FORM_VALIDATION from '@/shared/constants/forms/register/validationParams.ts';
import { ADDRESS_TYPE, type AddressOptions, type AddressType, SINGLE_ADDRESS } from '@/shared/types/address.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import styles from './addressView.module.scss';

class AddressView {
  private address: HTMLDivElement;

  private addressAsBillingCheckBox: InputModel | null = null;

  private addressByDefaultCheckBox: InputModel | null = null;

  private addressType: AddressType;

  private cityField: InputFieldModel;

  private countryField: InputFieldModel;

  private inputFields: InputFieldModel[] = [];

  private options: AddressOptions;

  private postalCodeField: InputFieldModel;

  private streetField: InputFieldModel;

  constructor(addressType: AddressType, options: AddressOptions) {
    this.addressType = addressType;
    this.options = options;
    this.streetField = this.createStreetField();
    this.cityField = this.createCityField();
    this.countryField = this.createCountryField();
    this.postalCodeField = this.createPostalCodeField();
    this.address = this.createHTML();
  }

  private appendInputFields(): void {
    this.inputFields.forEach((inputField) => {
      const inputFieldElement = inputField.getView().getHTML();
      const inputHTML = inputField.getView().getInput().getHTML();
      if (inputFieldElement instanceof HTMLLabelElement) {
        inputFieldElement.classList.add(styles.label);
        inputHTML.classList.add(styles.input);
        this.address.append(inputFieldElement);
      } else if (inputFieldElement instanceof InputModel) {
        this.address.append(inputFieldElement.getHTML());
      }
    });
  }

  private createAddressAsBillingCheckbox(innerContent: string): HTMLLabelElement {
    const checkboxLabel = createBaseElement({
      attributes: {
        for: SINGLE_ADDRESS,
      },
      cssClasses: [styles.checkboxLabel],
      tag: 'label',
    });

    const checkBoxText = createBaseElement({
      cssClasses: [styles.checkboxText],
      innerContent,
      tag: 'span',
    });

    this.addressAsBillingCheckBox = new InputModel({
      autocomplete: FORM_FIELDS.CHECKBOX.AUTOCOMPLETE,
      id: SINGLE_ADDRESS,
      placeholder: '',
      type: INPUT_TYPE.CHECK_BOX,
    });

    checkboxLabel.append(checkBoxText, this.addressAsBillingCheckBox.getHTML());

    return checkboxLabel;
  }

  private createAddressByDefaultCheckbox(innerContent: string): HTMLLabelElement {
    const checkboxLabel = createBaseElement({
      attributes: {
        for: this.addressType === ADDRESS_TYPE.SHIPPING ? ADDRESS_TYPE.SHIPPING : ADDRESS_TYPE.BILLING,
      },
      cssClasses: [styles.checkboxLabel],
      tag: 'label',
    });

    const checkBoxText = createBaseElement({
      cssClasses: [styles.checkboxText],
      innerContent,
      tag: 'span',
    });

    this.addressByDefaultCheckBox = new InputModel({
      autocomplete: FORM_FIELDS.CHECKBOX.AUTOCOMPLETE,
      id: this.addressType === ADDRESS_TYPE.SHIPPING ? ADDRESS_TYPE.SHIPPING : ADDRESS_TYPE.BILLING,
      placeholder: '',
      type: INPUT_TYPE.CHECK_BOX,
    });

    checkboxLabel.append(checkBoxText, this.addressByDefaultCheckBox.getHTML());

    return checkboxLabel;
  }

  private createCityField(): InputFieldModel {
    if (this.addressType === ADDRESS_TYPE.SHIPPING) {
      this.cityField = new InputFieldModel(
        FORM_FIELDS.SHIPPING_ADDRESS_CITY,
        FORM_VALIDATION.SHIPPING_ADDRESS_CITY_VALIDATE,
      );
    } else {
      this.cityField = new InputFieldModel(
        FORM_FIELDS.BILLING_ADDRESS_CITY,
        FORM_VALIDATION.BILLING_ADDRESS_CITY_VALIDATE,
      );
    }

    this.inputFields.push(this.cityField);

    return this.cityField;
  }

  private createCountryField(): InputFieldModel {
    if (this.addressType === ADDRESS_TYPE.SHIPPING) {
      this.countryField = new InputFieldModel(
        FORM_FIELDS.SHIPPING_ADDRESS_COUNTRY,
        FORM_VALIDATION.SHIPPING_ADDRESS_COUNTRY_VALIDATE,
      );
    } else {
      this.countryField = new InputFieldModel(
        FORM_FIELDS.BILLING_ADDRESS_COUNTRY,
        FORM_VALIDATION.BILLING_ADDRESS_COUNTRY_VALIDATE,
      );
    }

    this.inputFields.push(this.countryField);

    return this.countryField;
  }

  private createHTML(): HTMLDivElement {
    this.address = createBaseElement({
      cssClasses: [
        styles.address,
        this.addressType === ADDRESS_TYPE.SHIPPING ? styles.shippingAddressWrapper : styles.billingAddressWrapper,
      ],
      tag: 'div',
    });

    this.address.append(this.createTitle());

    this.appendInputFields();

    if (this.options.setDefault) {
      this.address.append(
        this.createAddressByDefaultCheckbox(
          this.addressType === ADDRESS_TYPE.SHIPPING
            ? FORM_TEXT.DEFAULT_SHIPPING_ADDRESS
            : FORM_TEXT.DEFAULT_BILLING_ADDRESS,
        ),
      );
    }
    if (this.options.setAsBilling) {
      this.address.append(this.createAddressAsBillingCheckbox(FORM_TEXT.SINGLE_ADDRESS));
    }

    return this.address;
  }

  private createPostalCodeField(): InputFieldModel {
    if (this.addressType === ADDRESS_TYPE.SHIPPING) {
      this.postalCodeField = new InputFieldModel(
        FORM_FIELDS.SHIPPING_ADDRESS_POSTAL_CODE,
        FORM_VALIDATION.SHIPPING_ADDRESS_POSTAL_CODE_VALIDATE,
      );
    } else {
      this.postalCodeField = new InputFieldModel(
        FORM_FIELDS.BILLING_ADDRESS_POSTAL_CODE,
        FORM_VALIDATION.BILLING_ADDRESS_POSTAL_CODE_VALIDATE,
      );
    }

    this.inputFields.push(this.postalCodeField);

    return this.postalCodeField;
  }

  private createStreetField(): InputFieldModel {
    if (this.addressType === ADDRESS_TYPE.SHIPPING) {
      this.streetField = new InputFieldModel(
        FORM_FIELDS.SHIPPING_ADDRESS_STREET,
        FORM_VALIDATION.SHIPPING_ADDRESS_STREET_VALIDATE,
      );
    } else {
      this.streetField = new InputFieldModel(
        FORM_FIELDS.BILLING_ADDRESS_STREET,
        FORM_VALIDATION.BILLING_ADDRESS_STREET_VALIDATE,
      );
    }

    this.inputFields.push(this.streetField);

    return this.streetField;
  }

  private createTitle(): HTMLHeadingElement {
    return createBaseElement({
      cssClasses: [styles.title],
      innerContent:
        this.addressType === ADDRESS_TYPE.SHIPPING ? TITLE_TEXT.en.SHIPPING_ADDRESS : TITLE_TEXT.en.BILLING_ADDRESS,
      tag: 'h3',
    });
  }

  public getAddressAsBillingCheckBox(): InputModel | null {
    return this.addressAsBillingCheckBox;
  }

  public getAddressByDefaultCheckBox(): InputModel | null {
    return this.addressByDefaultCheckBox;
  }

  public getCityField(): InputFieldModel {
    return this.cityField;
  }

  public getCountryField(): InputFieldModel {
    return this.countryField;
  }

  public getHTML(): HTMLDivElement {
    return this.address;
  }

  public getInputFields(): InputFieldModel[] {
    return this.inputFields;
  }

  public getPostalCodeField(): InputFieldModel {
    return this.postalCodeField;
  }

  public getStreetField(): InputFieldModel {
    return this.streetField;
  }

  public switchVisibilityAddressWrapper(isVisible: boolean): void {
    this.address.classList.toggle(styles.hidden, isVisible);
  }
}

export default AddressView;
