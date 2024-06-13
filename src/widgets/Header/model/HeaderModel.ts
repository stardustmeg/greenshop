import type { Cart } from '@/shared/types/cart.ts';
import type { ShoppingList } from '@/shared/types/shopping-list.ts';

import RouterModel from '@/app/Router/model/RouterModel.ts';
import CountBadgeModel from '@/entities/CountBadge/model/CountBadgeModel.ts';
import NavigationModel from '@/entities/Navigation/model/NavigationModel.ts';
import getCartModel from '@/shared/API/cart/model/CartModel.ts';
import getCustomerModel, { CustomerModel } from '@/shared/API/customer/model/CustomerModel.ts';
import getShoppingListModel from '@/shared/API/shopping-list/model/ShoppingListModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setAuthToken, setCurrentLanguage, switchIsUserLoggedIn } from '@/shared/Store/actions.ts';
import observeStore, { selectIsUserLoggedIn } from '@/shared/Store/observer.ts';
import { LANGUAGE_CHOICE } from '@/shared/constants/common.ts';
import { SERVER_MESSAGE_KEYS } from '@/shared/constants/messages.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';
import { showErrorMessage, showSuccessMessage } from '@/shared/utils/userMessage.ts';

import HeaderView from '../view/HeaderView.ts';

class HeaderModel {
  private cartCountBadge = new CountBadgeModel();

  private navigation: NavigationModel;

  private parent: HTMLDivElement;

  private view = new HeaderView();

  private wishListCountBadge = new CountBadgeModel();

  constructor(parent: HTMLDivElement) {
    this.parent = parent;
    this.navigation = new NavigationModel();
    this.init();
  }

  private cartChangeHandler(cart: Cart): boolean {
    this.cartCountBadge.updateBadgeCount(cart.products.reduce((acc, item) => acc + item.quantity, 0));
    return true;
  }

  private checkCurrentUser(): void {
    const { isUserLoggedIn } = getStore().getState();
    const logoutButton = this.view.getLogoutButton();
    if (isUserLoggedIn) {
      this.view.getToProfileLink().setEnabled();
      this.view.getToAddressesLink().setEnabled();
      logoutButton.setEnabled();
    } else {
      logoutButton.setDisabled();
      this.view.getToProfileLink().setDisabled();
      this.view.getToAddressesLink().setDisabled();
    }
  }

  private init(): void {
    this.view.getWrapper().append(this.navigation.getHTML());
    this.view.getToCartLink().getHTML().append(this.cartCountBadge.getHTML());
    this.view.getToWishlistLink().getHTML().append(this.wishListCountBadge.getHTML());
    this.parent.insertAdjacentElement('beforebegin', this.view.getNavigationWrapper());
    this.checkCurrentUser();
    this.setLogoHandler();
    this.observeCurrentUser();
    this.setLogoutButtonHandler();
    this.setLinksHandler();
    this.setChangeLanguageCheckboxHandler();
    this.observeCartChange();
    this.observeShoppingListChange();
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
    return getCartModel().observeCartChange(this.cartChangeHandler.bind(this));
  }

  private observeCurrentUser(): void {
    observeStore(selectIsUserLoggedIn, () => {
      this.checkCurrentUser();
    });
  }

  private observeShoppingListChange(): void {
    getShoppingListModel().subscribe(this.shoppingListChangeHandler.bind(this));
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
            showSuccessMessage(SERVER_MESSAGE_KEYS.LANGUAGE_CHANGED);
          }
        } catch (error) {
          showErrorMessage(error);
        }
      } else {
        getStore().dispatch(setCurrentLanguage(newLanguage));
        showSuccessMessage(SERVER_MESSAGE_KEYS.LANGUAGE_CHANGED);
      }
    });
  }

  private setLinksHandler(): void {
    this.view
      .getToCartLink()
      .getHTML()
      .addEventListener('click', (event) => {
        event.preventDefault();
        RouterModel.getInstance().navigateTo(PAGE_ID.CART_PAGE);
      });
    this.view
      .getToWishlistLink()
      .getHTML()
      .addEventListener('click', (event) => {
        event.preventDefault();
        RouterModel.getInstance().navigateTo(PAGE_ID.WISHLIST_PAGE);
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

  private shoppingListChangeHandler(shoppingList: ShoppingList): void {
    this.wishListCountBadge.updateBadgeCount(shoppingList.products.length);
  }

  public getHTML(): HTMLElement {
    return this.view.getHTML();
  }
}
export default HeaderModel;
