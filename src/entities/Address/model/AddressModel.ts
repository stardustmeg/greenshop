import type { Address, PersonalData } from '@/shared/types/user.ts';

import CountryChoiceModel from '@/features/CountryChoice/model/CountryChoiceModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { ADDRESS_TYPE, type AddressOptions, type AddressType } from '@/shared/types/address.ts';
import formattedText from '@/shared/utils/formattedText.ts';

import AddressView from '../view/AddressView.ts';

class AddressModel {
  private addressType: AddressType;

  private view: AddressView;

  constructor(addressType: AddressType, options: AddressOptions) {
    this.addressType = addressType;
    this.view = new AddressView(addressType, options);
    this.init();
  }

  private init(): boolean {
    this.getHTML().append(new CountryChoiceModel(this.view.getCountryField().getView().getInput().getHTML()).getHTML());
    return true;
  }

  public getAddressData(personalData: PersonalData): Address {
    const store = getStore().getState();
    const addressData: Address = {
      city: formattedText(this.view.getCityField().getView().getValue()),
      country: this.addressType === ADDRESS_TYPE.BILLING ? store.billingCountry : store.shippingCountry,
      email: personalData.email,
      firstName: personalData.firstName,
      id: '',
      lastName: personalData.lastName,
      postalCode: this.view.getPostalCodeField().getView().getValue(),
      state: '',
      streetName: formattedText(this.view.getStreetField().getView().getValue()),
      streetNumber: '',
    };
    return addressData;
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }

  public getView(): AddressView {
    return this.view;
  }
}

export default AddressModel;
