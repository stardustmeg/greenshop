import type { Address, User } from '@/shared/types/user.ts';

import AddressEditModel from '@/features/AddressEdit/model/AddressEditModel.ts';
import getCustomerModel, { CustomerModel } from '@/shared/API/customer/model/CustomerModel.ts';
import ConfirmModel from '@/shared/Confirm/model/ConfirmModel.ts';
import EventMediatorModel from '@/shared/EventMediator/model/EventMediatorModel.ts';
import LoaderModel from '@/shared/Loader/model/LoaderModel.ts';
import modal from '@/shared/Modal/model/ModalModel.ts';
import serverMessageModel from '@/shared/ServerMessage/model/ServerMessageModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setBillingCountry } from '@/shared/Store/actions.ts';
import MEDIATOR_EVENT from '@/shared/constants/events.ts';
import { ADDRESS_TYPE, type AddressTypeType } from '@/shared/constants/forms.ts';
import { MESSAGE_STATUS, SERVER_MESSAGE_KEYS } from '@/shared/constants/messages.ts';
import { LOADER_SIZE } from '@/shared/constants/sizes.ts';
import showErrorMessage from '@/shared/utils/userMessage.ts';

import UserAddressView from '../view/UserAddressView.ts';

class UserAddressModel {
  private callback: (isDisabled: boolean) => void;

  private currentAddress: Address;

  private labels: Map<HTMLDivElement, { inactive?: boolean; type: AddressTypeType }>;

  private view: UserAddressView;

  constructor(
    address: Address,
    activeTypes: AddressTypeType[],
    callback: (isDisabled: boolean) => void,
    inactiveTypes?: AddressTypeType[],
  ) {
    this.callback = callback;
    this.currentAddress = address;
    this.view = new UserAddressView(address, activeTypes, inactiveTypes);
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

  private async handleAddressType(user: User, activeType: AddressTypeType, inactive: boolean): Promise<void> {
    const customerModel = getCustomerModel();

    const actions = {
      [ADDRESS_TYPE.BILLING]: inactive
        ? CustomerModel.actionAddBillingAddress(this.currentAddress.id)
        : CustomerModel.actionRemoveBillingAddress(this.currentAddress),
      [ADDRESS_TYPE.DEFAULT_BILLING]: inactive
        ? CustomerModel.actionEditDefaultBillingAddress(this.currentAddress.id)
        : CustomerModel.actionEditDefaultBillingAddress(undefined),
      [ADDRESS_TYPE.DEFAULT_SHIPPING]: inactive
        ? CustomerModel.actionEditDefaultShippingAddress(this.currentAddress.id)
        : CustomerModel.actionEditDefaultShippingAddress(undefined),
      [ADDRESS_TYPE.SHIPPING]: inactive
        ? CustomerModel.actionAddShippingAddress(this.currentAddress.id)
        : CustomerModel.actionRemoveShippingAddress(this.currentAddress),
    };

    const action = actions[activeType];

    if (action) {
      await customerModel.editCustomer([action], user);
    }
  }

  private async labelClickHandler(activeType: AddressTypeType, inactive?: boolean): Promise<void> {
    const loader = new LoaderModel(LOADER_SIZE.MEDIUM);
    loader.setAbsolutePosition();
    this.callback(true);
    this.view.toggleState(true);
    this.getHTML().append(loader.getHTML());
    try {
      const user = await getCustomerModel().getCurrentUser();
      if (user) {
        await this.handleAddressType(user, activeType, inactive ?? false);
        EventMediatorModel.getInstance().notify(MEDIATOR_EVENT.REDRAW_USER_ADDRESSES, '');
        serverMessageModel.showServerMessage(SERVER_MESSAGE_KEYS.ADDRESS_STATUS_CHANGED, MESSAGE_STATUS.SUCCESS);
      }
    } catch (error) {
      showErrorMessage(error);
    } finally {
      this.view.toggleState(false);
      loader.getHTML().remove();
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

          getStore().dispatch(setBillingCountry(address.country));
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
