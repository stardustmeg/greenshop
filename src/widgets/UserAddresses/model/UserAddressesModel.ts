import type { AddressTypeType } from '@/shared/constants/forms.ts';
import type { Address, User } from '@/shared/types/user.ts';

import UserAddressModel from '@/entities/UserAddress/model/UserAddressModel.ts';
import AddressAddModel from '@/features/AddressAdd/model/AddressAddModel.ts';
import modal from '@/shared/Modal/model/ModalModel.ts';
import { ADDRESS_TYPE, DEFAULT_ADDRESS } from '@/shared/constants/forms.ts';
import determineNewAddress from '@/shared/utils/determineNewAddress.ts';
import { arrayContainsObjectWithValue, objectHasPropertyValue } from '@/shared/utils/hasValue.ts';

import UserAddressesView from '../view/UserAddressesView.ts';

class UserAddressesModel {
  private currentUser: User;

  private view: UserAddressesView;

  constructor(user: User) {
    this.currentUser = user;
    this.view = new UserAddressesView();
    this.createCurrentAddresses();
    this.setCreateBillingAddressHandler();
    this.setCreateShippingAddressHandler();
  }

  private createCurrentAddresses(): void {
    const { addresses } = this.currentUser;

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

      const createAddress = (activeTypes: AddressTypeType[], inactiveTypes?: AddressTypeType[]): UserAddressModel =>
        new UserAddressModel(this.currentUser, address, activeTypes, inactiveTypes);

      const newAddress = determineNewAddress(addressesContainsID, defaultContainsID, this.currentUser, createAddress);

      if (newAddress) {
        this.view.getAddressesListWrapper().append(newAddress.getHTML());
      }
    });
  }

  private setCreateBillingAddressHandler(): void {
    this.view
      .getCreateBillingAddressButton()
      .getHTML()
      .addEventListener('click', () => {
        const newAddressForm = new AddressAddModel(ADDRESS_TYPE.BILLING, DEFAULT_ADDRESS).getHTML();
        modal.show();
        modal.setContent(newAddressForm);
      });
  }

  private setCreateShippingAddressHandler(): void {
    this.view
      .getCreateShippingAddressButton()
      .getHTML()
      .addEventListener('click', () => {
        const newAddressForm = new AddressAddModel(ADDRESS_TYPE.SHIPPING, DEFAULT_ADDRESS).getHTML();
        modal.show();
        modal.setContent(newAddressForm);
      });
  }

  public getHTML(): HTMLElement {
    return this.view.getHTML();
  }

  public hide(): void {
    this.view.hide();
  }

  public show(): void {
    this.view.show();
  }
}

export default UserAddressesModel;
