import InputFieldModel from '@/entities/InputField/model/InputFieldModel.ts';
import InputModel from '@/shared/Input/model/InputModel.ts';
import { FORM_TEXT, FORM_TEXT_KEY, INPUT_TYPE } from '@/shared/constants/forms.ts';
import * as FORM_FIELDS from '@/shared/constants/forms/fieldParams.ts';
import { TITLE_TEXT, TITLE_TEXT_KEYS } from '@/shared/constants/forms/text.ts';
import * as FORM_VALIDATION from '@/shared/constants/forms/validationParams.ts';
import { ADDRESS, type AddressOptions, type AddressType, SINGLE_ADDRESS } from '@/shared/types/address.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import getCurrentLanguage from '@/shared/utils/getCurrentLanguage.ts';
import observeCurrentLanguage from '@/shared/utils/observeCurrentLanguage.ts';

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

  private createAddressAsBillingCheckbox(): HTMLLabelElement {
    const checkboxLabel = createBaseElement({
      attributes: {
        for: SINGLE_ADDRESS,
      },
      cssClasses: [styles.checkboxLabel],
      tag: 'label',
    });

    const checkBoxText = createBaseElement({
      cssClasses: [styles.checkboxText],
      innerContent: FORM_TEXT[getCurrentLanguage()].SINGLE_ADDRESS,
      tag: 'span',
    });
    observeCurrentLanguage(checkBoxText, FORM_TEXT, FORM_TEXT_KEY.SINGLE_ADDRESS);

    this.addressAsBillingCheckBox = new InputModel({
      autocomplete: FORM_FIELDS.CHECKBOX.AUTOCOMPLETE,
      id: SINGLE_ADDRESS,
      placeholder: '',
      type: INPUT_TYPE.CHECK_BOX,
    });

    checkboxLabel.append(checkBoxText, this.addressAsBillingCheckBox.getHTML());

    return checkboxLabel;
  }

  private createAddressByDefaultCheckbox(): HTMLLabelElement {
    const checkboxLabel = createBaseElement({
      attributes: {
        for: this.addressType === ADDRESS.SHIPPING ? ADDRESS.SHIPPING : ADDRESS.BILLING,
      },
      cssClasses: [styles.checkboxLabel],
      tag: 'label',
    });

    const currentLanguage = getCurrentLanguage();

    const textContent =
      this.addressType === ADDRESS.SHIPPING
        ? FORM_TEXT[currentLanguage].DEFAULT_SHIPPING_ADDRESS
        : FORM_TEXT[currentLanguage].DEFAULT_BILLING_ADDRESS;
    const checkBoxText = createBaseElement({
      cssClasses: [styles.checkboxText],
      innerContent: textContent,
      tag: 'span',
    });
    observeCurrentLanguage(
      checkBoxText,
      FORM_TEXT,
      this.addressType === ADDRESS.SHIPPING
        ? FORM_TEXT_KEY.DEFAULT_SHIPPING_ADDRESS
        : FORM_TEXT_KEY.DEFAULT_BILLING_ADDRESS,
    );

    this.addressByDefaultCheckBox = new InputModel({
      autocomplete: FORM_FIELDS.CHECKBOX.AUTOCOMPLETE,
      id: this.addressType === ADDRESS.SHIPPING ? ADDRESS.SHIPPING : ADDRESS.BILLING,
      placeholder: '',
      type: INPUT_TYPE.CHECK_BOX,
    });

    checkboxLabel.append(checkBoxText, this.addressByDefaultCheckBox.getHTML());

    return checkboxLabel;
  }

  private createCityField(): InputFieldModel {
    if (this.addressType === ADDRESS.SHIPPING) {
      this.cityField = new InputFieldModel(FORM_FIELDS.SHIPPING_ADDRESS_CITY, FORM_VALIDATION.ADDRESS_CITY_VALIDATE);
    } else {
      this.cityField = new InputFieldModel(FORM_FIELDS.BILLING_ADDRESS_CITY, FORM_VALIDATION.ADDRESS_CITY_VALIDATE);
    }

    this.inputFields.push(this.cityField);

    return this.cityField;
  }

  private createCountryField(): InputFieldModel {
    if (this.addressType === ADDRESS.SHIPPING) {
      this.countryField = new InputFieldModel(
        FORM_FIELDS.SHIPPING_ADDRESS_COUNTRY,
        FORM_VALIDATION.ADDRESS_COUNTRY_VALIDATE,
      );
    } else {
      this.countryField = new InputFieldModel(
        FORM_FIELDS.BILLING_ADDRESS_COUNTRY,
        FORM_VALIDATION.ADDRESS_COUNTRY_VALIDATE,
      );
    }

    this.inputFields.push(this.countryField);

    return this.countryField;
  }

  private createHTML(): HTMLDivElement {
    this.address = createBaseElement({
      cssClasses: [
        styles.address,
        this.addressType === ADDRESS.SHIPPING ? styles.shippingAddressWrapper : styles.billingAddressWrapper,
      ],
      tag: 'div',
    });

    this.address.append(this.createTitle());

    this.appendInputFields();

    if (this.options.setDefault) {
      this.address.append(this.createAddressByDefaultCheckbox());
    }
    if (this.options.setAsBilling) {
      this.address.append(this.createAddressAsBillingCheckbox());
    }

    return this.address;
  }

  private createPostalCodeField(): InputFieldModel {
    if (this.addressType === ADDRESS.SHIPPING) {
      this.postalCodeField = new InputFieldModel(
        FORM_FIELDS.SHIPPING_ADDRESS_POSTAL_CODE,
        FORM_VALIDATION.ADDRESS_POSTAL_CODE_VALIDATE,
      );
    } else {
      this.postalCodeField = new InputFieldModel(
        FORM_FIELDS.BILLING_ADDRESS_POSTAL_CODE,
        FORM_VALIDATION.ADDRESS_POSTAL_CODE_VALIDATE,
      );
    }

    this.inputFields.push(this.postalCodeField);

    return this.postalCodeField;
  }

  private createStreetField(): InputFieldModel {
    if (this.addressType === ADDRESS.SHIPPING) {
      this.streetField = new InputFieldModel(
        FORM_FIELDS.SHIPPING_ADDRESS_STREET,
        FORM_VALIDATION.ADDRESS_STREET_VALIDATE,
      );
    } else {
      this.streetField = new InputFieldModel(
        FORM_FIELDS.BILLING_ADDRESS_STREET,
        FORM_VALIDATION.ADDRESS_STREET_VALIDATE,
      );
    }

    this.inputFields.push(this.streetField);

    return this.streetField;
  }

  private createTitle(): HTMLHeadingElement {
    let titleText: string;
    let key: string;

    const currentLanguage = getCurrentLanguage();

    switch (this.addressType) {
      case ADDRESS.BILLING:
        titleText = TITLE_TEXT[currentLanguage].BILLING_ADDRESS;
        key = TITLE_TEXT_KEYS.BILLING_ADDRESS;
        break;
      case ADDRESS.SHIPPING:
        titleText = TITLE_TEXT[currentLanguage].SHIPPING_ADDRESS;
        key = TITLE_TEXT_KEYS.SHIPPING_ADDRESS;
        break;
      default:
        titleText = TITLE_TEXT[currentLanguage].ADDRESS;
        key = TITLE_TEXT_KEYS.ADDRESS;
        break;
    }

    const title = createBaseElement({
      cssClasses: [styles.title],
      innerContent: titleText,
      tag: 'h3',
    });
    observeCurrentLanguage(title, TITLE_TEXT, key);
    return title;
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
