import type InputFieldModel from '@/entities/InputField/model/InputFieldModel.ts';
import type { AddressType } from '@/shared/types/address.ts';
import type { Address, User } from '@/shared/types/user.ts';
import type { MyCustomerUpdateAction } from '@commercetools/platform-sdk';

import AddressModel from '@/entities/Address/model/AddressModel.ts';
import getCustomerModel, { CustomerModel } from '@/shared/API/customer/model/CustomerModel.ts';
import EventMediatorModel from '@/shared/EventMediator/model/EventMediatorModel.ts';
import LoaderModel from '@/shared/Loader/model/LoaderModel.ts';
import modal from '@/shared/Modal/model/ModalModel.ts';
import getStore from '@/shared/Store/Store.ts';
import MEDIATOR_EVENT from '@/shared/constants/events.ts';
import { SERVER_MESSAGE_KEY } from '@/shared/constants/messages.ts';
import { LOADER_SIZE } from '@/shared/constants/sizes.ts';
import { ADDRESS } from '@/shared/types/address.ts';
import formattedText from '@/shared/utils/formattedText.ts';
import { showErrorMessage, showSuccessMessage } from '@/shared/utils/userMessage.ts';

import AddressAddView from '../view/AddressAddView.ts';

class AddressAddModel {
  private addressType: AddressType;

  private inputFields: InputFieldModel[] = [];

  private newAddress: AddressModel;

  private view = new AddressAddView();

  constructor(type: AddressType, options: Record<string, boolean>) {
    this.addressType = type;
    this.newAddress = new AddressModel(options, this.addressType);
    this.init();
  }

  private async addAddressType(): Promise<void> {
    try {
      const updatedUser = await getCustomerModel().getCurrentUser();
      if (updatedUser) {
        const newAddress = this.getNewAddress(updatedUser);
        if (newAddress?.id) {
          const actions = this.getAddressActions(newAddress.id);
          if (this.shouldSetDefaultAddress()) {
            actions.push(this.getDefaultAddressAction(newAddress.id));
          }
          await getCustomerModel().editCustomer(actions, updatedUser);
          this.handleSuccess();
        }
      }
    } catch (error) {
      showErrorMessage(error);
    }
  }

  private createAddress(user: User): Address {
    const store = getStore().getState();
    const { email, firstName, lastName } = user;
    const { city, postalCode, streetName } = this.getFormAddressData();
    return {
      city,
      country: this.addressType === ADDRESS.BILLING ? store.billingCountry : store.shippingCountry,
      email,
      firstName,
      id: '',
      lastName,
      postalCode,
      state: '',
      streetName,
      streetNumber: '',
    };
  }

  private async createNewAddress(): Promise<void> {
    const loader = new LoaderModel(LOADER_SIZE.SMALL).getHTML();
    this.view.getSaveChangesButton().getHTML().append(loader);
    try {
      const user = await getCustomerModel().getCurrentUser();
      if (user) {
        const address = this.createAddress(user);
        await this.saveAddress(user, address);
        await this.addAddressType();
      }
    } catch (error) {
      showErrorMessage(error);
    } finally {
      loader.remove();
    }
  }

  private getAddressActions(addressId: string): MyCustomerUpdateAction[] {
    const addAddressAction =
      this.addressType === ADDRESS.BILLING
        ? CustomerModel.actionAddBillingAddress(addressId)
        : CustomerModel.actionAddShippingAddress(addressId);

    return [addAddressAction];
  }

  private getDefaultAddressAction(addressId: string): MyCustomerUpdateAction {
    return this.addressType === ADDRESS.BILLING
      ? CustomerModel.actionEditDefaultBillingAddress(addressId)
      : CustomerModel.actionEditDefaultShippingAddress(addressId);
  }

  private getFormAddressData(): Record<string, string> {
    return {
      city: formattedText(this.newAddress.getView().getCityField().getView().getInput().getValue()),
      country: this.newAddress.getView().getCountryField().getView().getInput().getValue(),
      postalCode: this.newAddress.getView().getPostalCodeField().getView().getInput().getValue(),
      streetName: formattedText(this.newAddress.getView().getStreetField().getView().getInput().getValue()),
    };
  }

  private getNewAddress(user: User): Address | null {
    return user.addresses[user.addresses.length - 1] || null;
  }

  private handleSuccess(): void {
    EventMediatorModel.getInstance().notify(MEDIATOR_EVENT.REDRAW_USER_ADDRESSES, '');
    showSuccessMessage(SERVER_MESSAGE_KEY.ADDRESS_ADDED);
    modal.hide();
  }

  private init(): void {
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
  }

  private async saveAddress(user: User, address: Address): Promise<void> {
    await getCustomerModel().editCustomer([CustomerModel.actionAddAddress(address)], user);
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
    inputHTML.addEventListener('input', () => this.switchSubmitFormButtonAccess());
    return true;
  }

  private setPreventDefaultToForm(): boolean {
    this.getHTML().addEventListener('submit', (event) => event.preventDefault());
    return true;
  }

  private setSubmitFormHandler(): boolean {
    const submitButton = this.view.getSaveChangesButton();
    submitButton.getHTML().addEventListener('click', async () => {
      submitButton.setDisabled();
      await this.createNewAddress();
      submitButton.setEnabled();
    });
    return true;
  }

  private shouldSetDefaultAddress(): boolean {
    return this.newAddress.getView().getAddressByDefaultCheckBox()?.getHTML().checked || false;
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

export default AddressAddModel;
