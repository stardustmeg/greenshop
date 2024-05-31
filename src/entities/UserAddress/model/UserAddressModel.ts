import type { Address, User } from '@/shared/types/user.ts';

import AddressEditModel from '@/features/AddressEdit/model/AddressEditModel.ts';
import getCustomerModel, { CustomerModel } from '@/shared/API/customer/model/CustomerModel.ts';
import ConfirmModel from '@/shared/Confirm/model/ConfirmModel.ts';
import EventMediatorModel from '@/shared/EventMediator/model/EventMediatorModel.ts';
import modal from '@/shared/Modal/model/ModalModel.ts';
import serverMessageModel from '@/shared/ServerMessage/model/ServerMessageModel.ts';
import MEDIATOR_EVENT from '@/shared/constants/events.ts';
import { ADDRESS_TYPE, type AddressTypeType } from '@/shared/constants/forms.ts';
import { MESSAGE_STATUS, SERVER_MESSAGE_KEYS } from '@/shared/constants/messages.ts';
import showErrorMessage from '@/shared/utils/userMessage.ts';

import UserAddressView from '../view/UserAddressView.ts';

class UserAddressModel {
  private currentAddress: Address;

  private labels: Map<HTMLDivElement, { inactive?: boolean; type: AddressTypeType }>;

  private view: UserAddressView;

  constructor(user: User, address: Address, activeTypes: AddressTypeType[], inactiveTypes?: AddressTypeType[]) {
    this.currentAddress = address;
    this.view = new UserAddressView(user.locale, address, activeTypes, inactiveTypes);
    this.labels = this.view.getLabels();
    this.setEditButtonHandler(address);
    this.setDeleteButtonHandler(address);
    this.setLabelClickHandler();
  }

  private async deleteAddress(address: Address): Promise<void> {
    try {
      const user = await getCustomerModel().getCurrentUser();
      if (user) {
        try {
          await getCustomerModel().editCustomer([CustomerModel.actionRemoveAddress(address)], user);
          EventMediatorModel.getInstance().notify(MEDIATOR_EVENT.REDRAW_USER_ADDRESSES, '');
          serverMessageModel.showServerMessage(SERVER_MESSAGE_KEYS.ADDRESS_DELETED, MESSAGE_STATUS.SUCCESS);
        } catch (error) {
          showErrorMessage(error);
        }
      }
    } catch (error) {
      showErrorMessage(error);
    }
  }

  // eslint-disable-next-line max-lines-per-function
  private async handleAddressType(user: User, activeType: AddressTypeType, inactive: boolean): Promise<void> {
    const customerModel = getCustomerModel();

    if (inactive) {
      switch (activeType) {
        case ADDRESS_TYPE.BILLING:
          await customerModel.editCustomer([CustomerModel.actionAddBillingAddress(this.currentAddress.id)], user);
          break;

        case ADDRESS_TYPE.SHIPPING:
          await customerModel.editCustomer([CustomerModel.actionAddShippingAddress(this.currentAddress.id)], user);
          break;

        case ADDRESS_TYPE.DEFAULT_BILLING:
          await customerModel.editCustomer(
            [CustomerModel.actionEditDefaultBillingAddress(this.currentAddress.id)],
            user,
          );
          break;

        case ADDRESS_TYPE.DEFAULT_SHIPPING:
          await customerModel.editCustomer(
            [CustomerModel.actionEditDefaultShippingAddress(this.currentAddress.id)],
            user,
          );
          break;

        default:
          break;
      }
    } else {
      switch (activeType) {
        case ADDRESS_TYPE.BILLING:
        case ADDRESS_TYPE.DEFAULT_BILLING:
          await customerModel.editCustomer([CustomerModel.actionRemoveBillingAddress(this.currentAddress)], user);
          break;

        case ADDRESS_TYPE.SHIPPING:
        case ADDRESS_TYPE.DEFAULT_SHIPPING:
          await customerModel.editCustomer([CustomerModel.actionRemoveShippingAddress(this.currentAddress)], user);
          break;
        default:
          break;
      }
    }
  }

  private async labelClickHandler(activeType: AddressTypeType, inactive?: boolean): Promise<void> {
    try {
      const user = await getCustomerModel().getCurrentUser();
      if (user) {
        await this.handleAddressType(user, activeType, inactive ?? false);
        EventMediatorModel.getInstance().notify(MEDIATOR_EVENT.REDRAW_USER_ADDRESSES, '');
        serverMessageModel.showServerMessage(SERVER_MESSAGE_KEYS.ADDRESS_STATUS_CHANGED, MESSAGE_STATUS.SUCCESS);
      }
    } catch (error) {
      showErrorMessage(error);
    }
  }

  private setDeleteButtonHandler(address: Address): void {
    this.view
      .getDeleteButton()
      .getHTML()
      .addEventListener('click', () => {
        const confirmModel = new ConfirmModel(() => this.deleteAddress(address));
        modal.setContent(confirmModel.getHTML());
        modal.show();
      });
  }

  private setEditButtonHandler(address: Address): void {
    this.view
      .getEditButton()
      .getHTML()
      .addEventListener('click', async () => {
        try {
          const user = await getCustomerModel().getCurrentUser();
          if (!user) {
            return;
          }
          const newAddressEditForm = new AddressEditModel(address, user).getHTML();
          modal.show();
          modal.setContent(newAddressEditForm);
        } catch (error) {
          showErrorMessage(error);
        }
      });
  }

  private setLabelClickHandler(): void {
    this.labels.forEach((value: { inactive?: boolean; type: AddressTypeType }, label: HTMLDivElement) => {
      label.addEventListener('click', async () => {
        await this.labelClickHandler(value.type, value.inactive);
      });
    });
  }

  public getHTML(): HTMLLIElement {
    return this.view.getHTML();
  }
}

export default UserAddressModel;
