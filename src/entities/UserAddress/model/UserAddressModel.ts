import type { User } from '@/shared/types/user.ts';

import UserAddressView from '../view/UserAddressView.ts';

class UserAddressModel {
  private view: UserAddressView;

  constructor(user: User) {
    this.view = new UserAddressView(user);
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
