import type { AddressType } from '@/shared/constants/forms.ts';
import type { Address, User } from '@/shared/types/user.ts';

import UserAddressModel from '@/entities/UserAddress/model/UserAddressModel.ts';
import AddressAddModel from '@/features/AddressAdd/model/AddressAddModel.ts';
import getCustomerModel from '@/shared/API/customer/model/CustomerModel.ts';
import EventMediatorModel from '@/shared/EventMediator/model/EventMediatorModel.ts';
import modal from '@/shared/Modal/model/ModalModel.ts';
import MEDIATOR_EVENT from '@/shared/constants/events.ts';
import { ADDRESS, DEFAULT_ADDRESS } from '@/shared/constants/forms.ts';
import clearOutElement from '@/shared/utils/clearOutElement.ts';
import determineNewAddress from '@/shared/utils/determineNewAddress.ts';
import { arrayContainsObjectWithValue, objectHasPropertyValue } from '@/shared/utils/hasValue.ts';
import { showErrorMessage } from '@/shared/utils/userMessage.ts';

import UserAddressesView from '../view/UserAddressesView.ts';

class UserAddressesModel {
  private view = new UserAddressesView();

  constructor(user: User) {
    this.init(user);
  }

  private createCurrentAddresses(user: User): void {
    const { addresses } = user;

    addresses.forEach((address) => {
      const KEY_TO_FIND = 'id';
      const addressesContainsID = (array: Address[]): boolean =>
        arrayContainsObjectWithValue(array, KEY_TO_FIND, address.id);
      const defaultContainsID = (defaultAddress: Address | null): boolean => {
        if (!defaultAddress) {
          return false;
        }
        return objectHasPropertyValue(defaultAddress, KEY_TO_FIND, address.id);
      };

      const createAddress = (activeTypes: AddressType[], inactiveTypes?: AddressType[]): UserAddressModel =>
        new UserAddressModel(address, activeTypes, inactiveTypes);

      const newAddress = determineNewAddress(addressesContainsID, defaultContainsID, user, createAddress);

      if (newAddress) {
        this.view.getAddressesListWrapper().append(newAddress.getHTML());
      }
    });
  }

  private init(user: User): void {
    this.createCurrentAddresses(user);
    this.setCreateBillingAddressHandler();
    this.setCreateShippingAddressHandler();

    EventMediatorModel.getInstance().subscribe(
      MEDIATOR_EVENT.REDRAW_USER_ADDRESSES,
      this.redrawUserAddresses.bind(this),
    );
  }

  private async redrawUserAddresses(): Promise<void> {
    try {
      const user = await getCustomerModel().getCurrentUser();
      if (user) {
        clearOutElement(this.view.getAddressesListWrapper());
        this.createCurrentAddresses(user);
      }
    } catch (error) {
      showErrorMessage(error);
    }
  }

  private setCreateBillingAddressHandler(): void {
    this.view
      .getCreateBillingAddressButton()
      .getHTML()
      .addEventListener('click', () => {
        const newAddressForm = new AddressAddModel(ADDRESS.BILLING, DEFAULT_ADDRESS).getHTML();
        modal.show();
        modal.setContent(newAddressForm);
      });
  }

  private setCreateShippingAddressHandler(): void {
    this.view
      .getCreateShippingAddressButton()
      .getHTML()
      .addEventListener('click', () => {
        const newAddressForm = new AddressAddModel(ADDRESS.SHIPPING, DEFAULT_ADDRESS).getHTML();
        modal.show();
        modal.setContent(newAddressForm);
      });
  }

  public getHTML(): HTMLElement {
    return this.view.getHTML();
  }
}

export default UserAddressesModel;
