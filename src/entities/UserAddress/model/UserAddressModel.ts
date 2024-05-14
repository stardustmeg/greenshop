import UserAddressView from '../view/UserAddressView.ts';

class UserAddressModel {
  private view = new UserAddressView();

  constructor() {
    this.setEditInfoButtonHandler();
  }

  private setEditInfoButtonHandler(): boolean {
    const editInfoButton = this.view.getEditInfoButton();
    editInfoButton.getHTML().addEventListener('click', () => {
      // TBD Replace with edit action
    });
    return true;
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

export default UserAddressModel;
