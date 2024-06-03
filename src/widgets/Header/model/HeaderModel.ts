import type { Cart } from '@/shared/types/cart.ts';

import RouterModel from '@/app/Router/model/RouterModel.ts';
import NavigationModel from '@/entities/Navigation/model/NavigationModel.ts';
import getCartModel from '@/shared/API/cart/model/CartModel.ts';
import getCustomerModel, { CustomerModel } from '@/shared/API/customer/model/CustomerModel.ts';
import serverMessageModel from '@/shared/ServerMessage/model/ServerMessageModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setAuthToken, setCurrentLanguage, switchIsUserLoggedIn } from '@/shared/Store/actions.ts';
import observeStore, { selectIsUserLoggedIn } from '@/shared/Store/observer.ts';
import { LANGUAGE_CHOICE } from '@/shared/constants/common.ts';
import { MESSAGE_STATUS, SERVER_MESSAGE_KEYS } from '@/shared/constants/messages.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';
import showErrorMessage from '@/shared/utils/userMessage.ts';

import HeaderView from '../view/HeaderView.ts';

class HeaderModel {
  private cartChangeHandler = (cart: Cart): boolean => {
    this.view.updateCartCount(cart.products.length);
    return true;
  };

  private navigation: NavigationModel;

  private parent: HTMLDivElement;

  private view = new HeaderView();

  constructor(parent: HTMLDivElement) {
    this.parent = parent;
    this.navigation = new NavigationModel();
    this.init();
  }

  private checkCurrentUser(): void {
    const { isUserLoggedIn } = getStore().getState();
    const logoutButton = this.view.getLogoutButton();
    if (isUserLoggedIn) {
      this.view.getToProfileLink().setEnabled();
      logoutButton.setEnabled();
    } else {
      logoutButton.setDisabled();
      this.view.getToProfileLink().setDisabled();
    }
  }

  private init(): void {
    this.view.getWrapper().append(this.navigation.getHTML());
    this.parent.insertAdjacentElement('beforebegin', this.view.getNavigationWrapper());
    this.checkCurrentUser();
    this.setLogoHandler();
    this.observeCurrentUser();
    this.setLogoutButtonHandler();
    this.setCartLinkHandler();
    this.observeCartChange();
    this.setCartCount().catch(showErrorMessage);
    this.setChangeLanguageCheckboxHandler();
  }

  private async logoutHandler(): Promise<boolean> {
    localStorage.clear();
    getStore().dispatch(setAuthToken(null));
    getStore().dispatch(switchIsUserLoggedIn(false));

    await getCustomerModel().logout();

    RouterModel.getInstance().navigateTo(PAGE_ID.LOGIN_PAGE);
    return true;
  }

  private observeCartChange(): boolean {
    return getCartModel().observeCartChange(this.cartChangeHandler);
  }

  private observeCurrentUser(): void {
    observeStore(selectIsUserLoggedIn, () => {
      this.checkCurrentUser();
    });
  }

  private async setCartCount(): Promise<boolean> {
    const cart = await getCartModel().getCart();
    this.view.updateCartCount(cart.products.length);
    return true;
  }

  private setCartLinkHandler(): void {
    const logo = this.view.getToCartLink().getHTML();
    logo.addEventListener('click', (event) => {
      event.preventDefault();
      RouterModel.getInstance().navigateTo(PAGE_ID.CART_PAGE);
    });
  }

  private setChangeLanguageCheckboxHandler(): void {
    const switchLanguageCheckbox = this.view.getSwitchLanguageCheckbox().getHTML();
    switchLanguageCheckbox.addEventListener('click', async () => {
      const { currentLanguage, isUserLoggedIn } = getStore().getState();
      const newLanguage = currentLanguage === LANGUAGE_CHOICE.EN ? LANGUAGE_CHOICE.RU : LANGUAGE_CHOICE.EN;

      if (isUserLoggedIn) {
        try {
          const user = await getCustomerModel().getCurrentUser();
          if (user) {
            await getCustomerModel().editCustomer([CustomerModel.actionSetLocale(newLanguage)], user);
            getStore().dispatch(setCurrentLanguage(newLanguage));
            serverMessageModel.showServerMessage(SERVER_MESSAGE_KEYS.LANGUAGE_CHANGED, MESSAGE_STATUS.SUCCESS);
          }
        } catch (error) {
          showErrorMessage(error);
        }
      } else {
        getStore().dispatch(setCurrentLanguage(newLanguage));
        serverMessageModel.showServerMessage(SERVER_MESSAGE_KEYS.LANGUAGE_CHANGED, MESSAGE_STATUS.SUCCESS);
      }
    });
  }

  private setLogoHandler(): void {
    const logo = this.view.getLinkLogo().getHTML();
    logo.addEventListener('click', (event) => {
      event.preventDefault();
      RouterModel.getInstance().navigateTo(PAGE_ID.MAIN_PAGE);
    });
  }

  private setLogoutButtonHandler(): void {
    const logoutButton = this.view.getLogoutButton();
    logoutButton.getHTML().addEventListener('click', async () => {
      await this.logoutHandler();
      logoutButton.setDisabled();
    });
  }

  public getHTML(): HTMLElement {
    return this.view.getHTML();
  }
}
export default HeaderModel;
