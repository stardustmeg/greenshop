// import type InputFieldModel from '@/entities/InputField/model/InputFieldModel.ts';
// import type { UserAddressType } from '@/shared/constants/forms.ts';
// import type { Address } from '@/shared/types/user.ts';

// import AddressModel from '@/entities/Address/model/AddressModel.ts';
// import getCustomerModel from '@/shared/API/customer/model/CustomerModel.ts';
// import EventMediatorModel from '@/shared/EventMediator/model/EventMediatorModel.ts';
// import LoaderModel from '@/shared/Loader/model/LoaderModel.ts';
// import modal from '@/shared/Modal/model/ModalModel.ts';
// import serverMessageModel from '@/shared/ServerMessage/model/ServerMessageModel.ts';
// import MEDIATOR_EVENT from '@/shared/constants/events.ts';
// import { MESSAGE_STATUS, SERVER_MESSAGE_KEYS } from '@/shared/constants/messages.ts';
// import { LOADER_SIZE } from '@/shared/constants/sizes.ts';
// import showErrorMessage from '@/shared/utils/userMessage.ts';

// import AddressEditView from '../view/AddressEditView.ts';

class AddressEditModel {
  // private address: AddressModel;
  // private currentAddress: Address;
  // private inputFields: InputFieldModel[] = [];
  // private view = new AddressEditView();
  // constructor(address: Address, type: UserAddressType) {
  //   this.address = new AddressModel(type, { setDefault: true });
  //   this.currentAddress = address;
  //   this.init();
  // }
  // private async editPersonalInfo(): Promise<void> {
  //   const loader = new LoaderModel(LOADER_SIZE.SMALL).getHTML();
  //   this.view.getSaveChangesButton().getHTML().append(loader);
  //   try {
  //     const user = await getCustomerModel().getCurrentUser();
  //     if (user) {
  //       // const {} = this.getFormPersonalData();
  //       await getCustomerModel().editCustomer(
  //         [
  //           // CustomerModel
  //         ],
  //         user,
  //       );
  //       modal.hide();
  //       serverMessageModel.showServerMessage(SERVER_MESSAGE_KEYS.ADDRESS_CHANGED, MESSAGE_STATUS.SUCCESS);
  //       EventMediatorModel.getInstance().notify(MEDIATOR_EVENT.REDRAW_USER_ADDRESS, '');
  //     }
  //   } catch (error) {
  //     showErrorMessage();
  //   } finally {
  //     loader.remove();
  //   }
  // }
  // private getFormPersonalData(): Record<string, string> {
  //   return {
  //     // dateOfBirth: this.personalInfo.getView().getDateOfBirthField().getView().getInput().getValue(),
  //     // email: this.view.getEmailField().getView().getInput().getValue(),
  //     // firstName: formattedText(this.personalInfo.getView().getFirstNameField().getView().getInput().getValue()),
  //     // lastName: formattedText(this.personalInfo.getView().getLastNameField().getView().getInput().getValue()),
  //   };
  // }
  // private init(): void {
  //   this.initiateFieldsValues();
  //   // this.getHTML().append(this.personalInfo.getHTML());
  //   this.inputFields = [
  //     this.personalInfo.getView().getFirstNameField(),
  //     this.personalInfo.getView().getLastNameField(),
  //     this.personalInfo.getView().getDateOfBirthField(),
  //   ];
  //   this.inputFields.forEach((inputField) => this.setInputFieldHandlers(inputField));
  //   this.setPreventDefaultToForm();
  //   this.setSubmitFormHandler();
  //   this.setCancelButtonHandler();
  // }
  // private initiateFieldsValues(): void {
  //   this.personalInfo.getView().getFirstNameField().getView().getInput().setValue(this.currentUser.firstName);
  //   this.personalInfo.getView().getLastNameField().getView().getInput().setValue(this.currentUser.lastName);
  //   this.personalInfo.getView().getDateOfBirthField().getView().getInput().setValue(this.currentUser.birthDate);
  // }
  // private setCancelButtonHandler(): boolean {
  //   const cancelButton = this.view.getCancelButton().getHTML();
  //   cancelButton.addEventListener('click', () => {
  //     modal.hide();
  //   });
  //   return true;
  // }
  // private setInputFieldHandlers(inputField: InputFieldModel): boolean {
  //   const inputHTML = inputField.getView().getInput().getHTML();
  //   inputHTML.addEventListener('input', () => {
  //     this.switchSubmitFormButtonAccess();
  //   });
  //   return true;
  // }
  // private setPreventDefaultToForm(): boolean {
  //   this.getHTML().addEventListener('submit', (event) => {
  //     event.preventDefault();
  //   });
  //   return true;
  // }
  // private setSubmitFormHandler(): boolean {
  //   const submitButton = this.view.getSaveChangesButton().getHTML();
  //   submitButton.addEventListener('click', () => this.editPersonalInfo());
  //   return true;
  // }
  // private switchSubmitFormButtonAccess(): boolean {
  //   if (this.inputFields.every((inputField) => inputField.getIsValid())) {
  //     this.view.getSaveChangesButton().setEnabled();
  //   } else {
  //     this.view.getSaveChangesButton().setDisabled();
  //   }
  //   return true;
  // }
  // public getHTML(): HTMLFormElement {
  // return this.view.getHTML();
  // }
}

export default AddressEditModel;
