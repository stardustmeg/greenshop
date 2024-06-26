import type { Address, User } from '@/shared/types/user.ts';

import AddressEditModel from '@/features/AddressEdit/model/AddressEditModel.ts';
import getCustomerModel, { CustomerModel } from '@/shared/API/customer/model/CustomerModel.ts';
import ConfirmModel from '@/shared/Confirm/model/ConfirmModel.ts';
import EventMediatorModel from '@/shared/EventMediator/model/EventMediatorModel.ts';
import LoaderModel from '@/shared/Loader/model/LoaderModel.ts';
import modal from '@/shared/Modal/model/ModalModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setBillingCountry } from '@/shared/Store/actions.ts';
import USER_MESSAGE from '@/shared/constants/confirmUserMessage.ts';
import MEDIATOR_EVENT from '@/shared/constants/events.ts';
import { ADDRESS, type AddressType } from '@/shared/constants/forms.ts';
import { SERVER_MESSAGE_KEY } from '@/shared/constants/messages.ts';
import { LOADER_SIZE } from '@/shared/constants/sizes.ts';
import getCurrentLanguage from '@/shared/utils/getCurrentLanguage.ts';
import { showErrorMessage, showSuccessMessage } from '@/shared/utils/userMessage.ts';

import UserAddressView from '../view/UserAddressView.ts';

class UserAddressModel {
  private currentAddress: Address;

  private labels: Map<HTMLDivElement, { inactive?: boolean; type: AddressType }>;

  private view: UserAddressView;

  constructor(address: Address, activeTypes: AddressType[], inactiveTypes?: AddressType[]) {
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
          showSuccessMessage(SERVER_MESSAGE_KEY.ADDRESS_DELETED);
        } catch (error) {
          showErrorMessage(error);
        }
      }
    } catch (error) {
      showErrorMessage(error);
    }
  }

  private async handleAddressType(user: User, activeType: AddressType, inactive: boolean): Promise<void> {
    const customerModel = getCustomerModel();

    const actions = {
      [ADDRESS.BILLING]: inactive
        ? CustomerModel.actionAddBillingAddress(this.currentAddress.id)
        : CustomerModel.actionRemoveBillingAddress(this.currentAddress),
      [ADDRESS.DEFAULT_BILLING]: inactive
        ? CustomerModel.actionEditDefaultBillingAddress(this.currentAddress.id)
        : CustomerModel.actionEditDefaultBillingAddress(),
      [ADDRESS.DEFAULT_SHIPPING]: inactive
        ? CustomerModel.actionEditDefaultShippingAddress(this.currentAddress.id)
        : CustomerModel.actionEditDefaultShippingAddress(),
      [ADDRESS.SHIPPING]: inactive
        ? CustomerModel.actionAddShippingAddress(this.currentAddress.id)
        : CustomerModel.actionRemoveShippingAddress(this.currentAddress),
    };

    const action = actions[activeType];

    if (action) {
      await customerModel.editCustomer([action], user);
    }
  }

  private async labelClickHandler(activeType: AddressType, inactive?: boolean): Promise<void> {
    const loader = new LoaderModel(LOADER_SIZE.MEDIUM);
    loader.setAbsolutePosition();
    this.view.toggleState(true);
    this.getHTML().append(loader.getHTML());
    try {
      const user = await getCustomerModel().getCurrentUser();
      if (user) {
        await this.handleAddressType(user, activeType, inactive ?? false);
        EventMediatorModel.getInstance().notify(MEDIATOR_EVENT.REDRAW_USER_ADDRESSES, '');
        showSuccessMessage(SERVER_MESSAGE_KEY.ADDRESS_STATUS_CHANGED);
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
        const confirmModel = new ConfirmModel(
          () => this.deleteAddress(address),
          USER_MESSAGE[getCurrentLanguage()].DELETE_ADDRESS,
        );
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
    this.labels.forEach((value: { inactive?: boolean; type: AddressType }, label: HTMLDivElement) => {
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
