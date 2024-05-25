import type { Address, User } from '@/shared/types/user.ts';

// import AddressEditModel from '@/features/AddressEdit/model/AddressEditModel.ts';
import getCustomerModel, { CustomerModel } from '@/shared/API/customer/model/CustomerModel.ts';
import LoaderModel from '@/shared/Loader/model/LoaderModel.ts';
import modal from '@/shared/Modal/model/ModalModel.ts';
import serverMessageModel from '@/shared/ServerMessage/model/ServerMessageModel.ts';
import { USER_ADDRESS_TYPE, type UserAddressType } from '@/shared/constants/forms.ts';
import { MESSAGE_STATUS, SERVER_MESSAGE_KEYS } from '@/shared/constants/messages.ts';
import { LOADER_SIZE } from '@/shared/constants/sizes.ts';
import showErrorMessage from '@/shared/utils/userMessage.ts';

import UserAddressView from '../view/UserAddressView.ts';

class UserAddressModel {
  private view: UserAddressView;

  constructor(user: User, address: Address, type: UserAddressType, defaultAddressId: string) {
    this.view = new UserAddressView(user, address, type, defaultAddressId);
    this.setDeleteButtonHandler(address, type);
    this.setEditButtonHandler(address, type);
  }

  private setDeleteButtonHandler(address: Address, type: UserAddressType): void {
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
              if (type === USER_ADDRESS_TYPE.BILLING) {
                await getCustomerModel().editCustomer([CustomerModel.actionRemoveBillingAddress(address)], user);
                await getCustomerModel().editCustomer([CustomerModel.actionRemoveAddress(address)], user);
                // TBD Check requests to delete address
              }
              if (type === USER_ADDRESS_TYPE.SHIPPING) {
                await getCustomerModel().editCustomer([CustomerModel.actionRemoveShippingAddress(address)], user);
              }
              serverMessageModel.showServerMessage(SERVER_MESSAGE_KEYS.ADDRESS_DELETED, MESSAGE_STATUS.SUCCESS);
              this.view.getHTML().remove();
            } catch (error) {
              showErrorMessage();
            }
          }
        } catch (error) {
          showErrorMessage();
        } finally {
          loader.remove();
        }
      });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private setEditButtonHandler(_address: Address, _type: UserAddressType): void {
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
          // modal.setContent(new AddressEditModel( address, _type).getHTML());
        } catch (error) {
          showErrorMessage();
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
