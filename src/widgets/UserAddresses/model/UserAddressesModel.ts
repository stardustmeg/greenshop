/* eslint-disable max-lines-per-function */
import type { AddressTypeType } from '@/shared/constants/forms.ts';
import type { Address, User } from '@/shared/types/user.ts';

import UserAddressModel from '@/entities/UserAddress/model/UserAddressModel.ts';
import AddressAddModel from '@/features/AddressAdd/model/AddressAddModel.ts';
import modal from '@/shared/Modal/model/ModalModel.ts';
import { ADDRESS_TYPE, DEFAULT_ADDRESS } from '@/shared/constants/forms.ts';
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
    const { addresses, billingAddress, defaultBillingAddressId, defaultShippingAddressId, shippingAddress } =
      this.currentUser;

    addresses.forEach((address) => {
      const adressesContainsID = (array: Address[]): boolean => arrayContainsObjectWithValue(array, 'id', address.id);
      const defaultContainsID = (defaultAddress: Address | null): boolean => {
        if (!defaultAddress) {
          return false;
        }
        return objectHasPropertyValue(defaultAddress, 'id', address.id);
      };

      const createAddress = (activeTypes: AddressTypeType[], inactiveTypes?: AddressTypeType[]): UserAddressModel =>
        new UserAddressModel(this.currentUser, address, activeTypes, inactiveTypes);

      let newAddress;

      switch (true) {
        case defaultContainsID(defaultBillingAddressId) && defaultContainsID(defaultShippingAddressId):
          newAddress = new UserAddressModel(this.currentUser, address, [
            ADDRESS_TYPE.BILLING,
            ADDRESS_TYPE.SHIPPING,
            ADDRESS_TYPE.DEFAULT_BILLING,
            ADDRESS_TYPE.DEFAULT_SHIPPING,
          ]);
          break;
        case adressesContainsID(shippingAddress) && defaultContainsID(defaultBillingAddressId):
          newAddress = createAddress(
            [ADDRESS_TYPE.BILLING, ADDRESS_TYPE.SHIPPING, ADDRESS_TYPE.DEFAULT_BILLING],
            [ADDRESS_TYPE.DEFAULT_SHIPPING],
          );
          break;
        case adressesContainsID(billingAddress) && defaultContainsID(defaultShippingAddressId):
          newAddress = createAddress(
            [ADDRESS_TYPE.BILLING, ADDRESS_TYPE.SHIPPING, ADDRESS_TYPE.DEFAULT_SHIPPING],
            [ADDRESS_TYPE.DEFAULT_BILLING],
          );
          break;
        case adressesContainsID(billingAddress) && adressesContainsID(shippingAddress):
          newAddress = createAddress(
            [ADDRESS_TYPE.BILLING, ADDRESS_TYPE.SHIPPING],
            [ADDRESS_TYPE.DEFAULT_BILLING, ADDRESS_TYPE.DEFAULT_SHIPPING],
          );
          break;
        case defaultContainsID(defaultBillingAddressId):
          newAddress = createAddress(
            [ADDRESS_TYPE.BILLING, ADDRESS_TYPE.DEFAULT_BILLING],
            [ADDRESS_TYPE.DEFAULT_SHIPPING, ADDRESS_TYPE.SHIPPING],
          );
          break;
        case defaultContainsID(defaultShippingAddressId):
          newAddress = createAddress(
            [ADDRESS_TYPE.SHIPPING, ADDRESS_TYPE.DEFAULT_SHIPPING],
            [ADDRESS_TYPE.DEFAULT_BILLING, ADDRESS_TYPE.BILLING],
          );
          break;
        case adressesContainsID(billingAddress):
          newAddress = createAddress(
            [ADDRESS_TYPE.BILLING],
            [ADDRESS_TYPE.DEFAULT_BILLING, ADDRESS_TYPE.DEFAULT_SHIPPING, ADDRESS_TYPE.SHIPPING],
          );
          break;
        case adressesContainsID(shippingAddress):
          newAddress = createAddress(
            [ADDRESS_TYPE.SHIPPING],
            [ADDRESS_TYPE.DEFAULT_BILLING, ADDRESS_TYPE.DEFAULT_SHIPPING, ADDRESS_TYPE.BILLING],
          );
          break;
        default:
          break;
      }

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
