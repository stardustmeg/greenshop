import type { UserAddressType } from '@/shared/constants/forms.ts';
import type { Address, User } from '@/shared/types/user.ts';

import UserAddressModel from '@/entities/UserAddress/model/UserAddressModel.ts';
import modal from '@/shared/Modal/model/ModalModel.ts';
import { USER_ADDRESS_TYPE } from '@/shared/constants/forms.ts';

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

  private createAddresses(addresses: Address[], type: UserAddressType, defaultAddressId = ''): void {
    addresses.forEach((address) => {
      this.getHTML().append(new UserAddressModel(this.currentUser, address, type, defaultAddressId).getHTML());
    });
  }

  private createCurrentAddresses(): void {
    const { billingAddress, defaultBillingAddressId, defaultShippingAddressId, shippingAddress } = this.currentUser;
    this.createAddresses(billingAddress, USER_ADDRESS_TYPE.BILLING, defaultBillingAddressId?.id);
    this.createAddresses(shippingAddress, USER_ADDRESS_TYPE.SHIPPING, defaultShippingAddressId?.id);
  }

  private setCreateBillingAddressHandler(): void {
    this.view
      .getCreateBillingAddressButton()
      .getHTML()
      .addEventListener('click', () => {
        modal.show(); // TBD Add new address feature
      });
  }

  private setCreateShippingAddressHandler(): void {
    this.view
      .getCreateShippingAddressButton()
      .getHTML()
      .addEventListener('click', () => {
        modal.show(); // TBD Add new address feature
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
