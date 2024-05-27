import type { AddressTypeType } from '@/shared/constants/forms.ts';
import type { Address, User } from '@/shared/types/user.ts';

import getCustomerModel, { CustomerModel } from '@/shared/API/customer/model/CustomerModel.ts';
import LoaderModel from '@/shared/Loader/model/LoaderModel.ts';
import modal from '@/shared/Modal/model/ModalModel.ts';
import serverMessageModel from '@/shared/ServerMessage/model/ServerMessageModel.ts';
import { MESSAGE_STATUS, SERVER_MESSAGE_KEYS } from '@/shared/constants/messages.ts';
import { LOADER_SIZE } from '@/shared/constants/sizes.ts';
import showErrorMessage from '@/shared/utils/userMessage.ts';

import UserAddressView from '../view/UserAddressView.ts';

class UserAddressModel {
  private view: UserAddressView;

  constructor(user: User, address: Address, activeTypes: AddressTypeType[], inactiveTypes?: AddressTypeType[]) {
    this.view = new UserAddressView(user.locale, address, activeTypes, inactiveTypes);

    this.setEditButtonHandler(address, activeTypes);
    this.setDeleteButtonHandler(address);
  }

  private setDeleteButtonHandler(address: Address): void {
    this.view
      .getDeleteButton()
      .getHTML()
      .addEventListener('click', async () => {
        const loader = new LoaderModel(LOADER_SIZE.SMALL).getHTML();
        this.view.getDeleteButton().getHTML().append(loader);
        try {
          const user = await getCustomerModel().getCurrentUser();
          if (user) {
            try {
              await getCustomerModel().editCustomer([CustomerModel.actionRemoveAddress(address)], user);
              serverMessageModel.showServerMessage(SERVER_MESSAGE_KEYS.ADDRESS_DELETED, MESSAGE_STATUS.SUCCESS);
              this.view.getHTML().remove();
            } catch (error) {
              showErrorMessage(error);
            }
          }
        } catch (error) {
          showErrorMessage(error);
        } finally {
          loader.remove();
        }
      });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private setEditButtonHandler(_address: Address, _types: AddressTypeType[]): void {
    this.view
      .getEditButton()
      .getHTML()
      .addEventListener('click', async () => {
        try {
          const user = await getCustomerModel().getCurrentUser();
          if (!user) {
            return;
          }
          modal.show();
        } catch (error) {
          showErrorMessage(error);
        } finally {
          modal.hide();
        }
      });
  }

  public getHTML(): HTMLLIElement {
    return this.view.getHTML();
  }
}

export default UserAddressModel;
