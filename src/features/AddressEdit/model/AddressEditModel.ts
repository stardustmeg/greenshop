import type InputFieldModel from '@/entities/InputField/model/InputFieldModel.ts';
import type { Address, User } from '@/shared/types/user.ts';

import AddressModel from '@/entities/Address/model/AddressModel.ts';
import getCustomerModel, { CustomerModel } from '@/shared/API/customer/model/CustomerModel.ts';
import EventMediatorModel from '@/shared/EventMediator/model/EventMediatorModel.ts';
import LoaderModel from '@/shared/Loader/model/LoaderModel.ts';
import modal from '@/shared/Modal/model/ModalModel.ts';
import serverMessageModel from '@/shared/ServerMessage/model/ServerMessageModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setBillingCountry } from '@/shared/Store/actions.ts';
import COUNTRIES_LIST from '@/shared/constants/countriesList.ts';
import MEDIATOR_EVENT from '@/shared/constants/events.ts';
import { MESSAGE_STATUS, SERVER_MESSAGE_KEYS } from '@/shared/constants/messages.ts';
import { LOADER_SIZE } from '@/shared/constants/sizes.ts';
import findKeyByValue from '@/shared/utils/findKeyByValue.ts';
import formattedText from '@/shared/utils/formattedText.ts';
import getCountryIndex from '@/shared/utils/getCountryIndex.ts';
import showErrorMessage from '@/shared/utils/userMessage.ts';

import AddressEditView from '../view/AddressEditView.ts';

class AddressEditModel {
  private currentAddress: Address;

  private inputFields: InputFieldModel[] = [];

  private newAddress: AddressModel;

  private user: User;

  private view = new AddressEditView();

  constructor(address: Address, user: User) {
    this.user = user;
    this.currentAddress = address;
    this.newAddress = new AddressModel({});
    this.init();
  }

  private createAddress(user: User): Address {
    const { email, firstName, lastName } = user;
    const { city, country, postalCode, streetName } = this.getFormAddressData();
    return {
      city,
      country: getCountryIndex(formattedText(country)),
      email,
      firstName,
      id: this.currentAddress.id,
      lastName,
      postalCode,
      state: '',
      streetName,
      streetNumber: '',
    };
  }

  private async editAddressInfo(): Promise<void> {
    const loader = new LoaderModel(LOADER_SIZE.SMALL).getHTML();
    this.view.getSaveChangesButton().getHTML().append(loader);
    try {
      const user = await getCustomerModel().getCurrentUser();
      if (user) {
        await getCustomerModel().editCustomer([CustomerModel.actionEditAddress(this.createAddress(user))], user);
        modal.hide();
        serverMessageModel.showServerMessage(SERVER_MESSAGE_KEYS.ADDRESS_CHANGED, MESSAGE_STATUS.SUCCESS);
        EventMediatorModel.getInstance().notify(MEDIATOR_EVENT.REDRAW_USER_ADDRESSES, '');
      }
    } catch (error) {
      showErrorMessage(error);
    } finally {
      loader.remove();
    }
  }

  private getFormAddressData(): Record<string, string> {
    return {
      city: formattedText(this.newAddress.getView().getCityField().getView().getInput().getValue()),
      country: this.newAddress.getView().getCountryField().getView().getInput().getValue(),
      postalCode: this.newAddress.getView().getPostalCodeField().getView().getInput().getValue(),
      streetName: formattedText(this.newAddress.getView().getStreetField().getView().getInput().getValue()),
    };
  }

  private init(): void {
    this.initiateFieldsValues();
    this.getHTML().append(this.newAddress.getHTML());
    this.inputFields = [
      this.newAddress.getView().getCityField(),
      this.newAddress.getView().getCountryField(),
      this.newAddress.getView().getPostalCodeField(),
      this.newAddress.getView().getStreetField(),
    ];
    this.inputFields.forEach((inputField) => this.setInputFieldHandlers(inputField));
    this.setPreventDefaultToForm();
    this.setSubmitFormHandler();
    this.setCancelButtonHandler();
    this.view.getHTML().append(this.newAddress.getHTML());
    getStore().dispatch(setBillingCountry(this.currentAddress.country));
  }

  private initiateFieldsValues(): void {
    const { locale } = this.user;
    const currentCountry = findKeyByValue(COUNTRIES_LIST[locale], this.currentAddress.country);
    this.newAddress.getView().getCityField().getView().getInput().setValue(this.currentAddress.city);
    this.newAddress
      .getView()
      .getCountryField()
      .getView()
      .getInput()
      .setValue(currentCountry ?? '');
    this.newAddress.getView().getStreetField().getView().getInput().setValue(this.currentAddress.streetName);
    this.newAddress.getView().getPostalCodeField().getView().getInput().setValue(this.currentAddress.postalCode);
  }

  private setCancelButtonHandler(): boolean {
    const cancelButton = this.view.getCancelButton().getHTML();
    cancelButton.addEventListener('click', () => {
      modal.hide();
    });
    return true;
  }

  private setInputFieldHandlers(inputField: InputFieldModel): boolean {
    const inputHTML = inputField.getView().getInput().getHTML();
    inputHTML.addEventListener('input', () => {
      this.switchSubmitFormButtonAccess();
    });
    return true;
  }

  private setPreventDefaultToForm(): boolean {
    this.getHTML().addEventListener('submit', (event) => {
      event.preventDefault();
    });
    return true;
  }

  private setSubmitFormHandler(): boolean {
    const submitButton = this.view.getSaveChangesButton().getHTML();
    submitButton.addEventListener('click', () => this.editAddressInfo());
    return true;
  }

  private switchSubmitFormButtonAccess(): boolean {
    if (this.inputFields.every((inputField) => inputField.getIsValid())) {
      this.view.getSaveChangesButton().setEnabled();
    } else {
      this.view.getSaveChangesButton().setDisabled();
    }
    return true;
  }

  public getHTML(): HTMLFormElement {
    return this.view.getHTML();
  }
}

export default AddressEditModel;
