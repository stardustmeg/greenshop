import UserAddressView from '../view/UserAddressView.ts';

class UserAddressModel {
  private view = new UserAddressView();

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
