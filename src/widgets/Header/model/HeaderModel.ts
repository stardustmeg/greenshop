import type RouterModel from '@/app/Router/model/RouterModel.ts';

import NavigationModel from '@/entities/Navigation/model/NavigationModel.ts';
import getCustomerModel, { CustomerModel } from '@/shared/API/customer/model/CustomerModel.ts';
import serverMessageModel from '@/shared/ServerMessage/model/ServerMessageModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setAuthToken, setCurrentLanguage, setCurrentUser, switchIsUserLoggedIn } from '@/shared/Store/actions.ts';
import observeStore, { selectIsUserLoggedIn } from '@/shared/Store/observer.ts';
import { LANGUAGE_CHOICE } from '@/shared/constants/common.ts';
import { MESSAGE_STATUS, SERVER_MESSAGE_KEYS } from '@/shared/constants/messages.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';
import showErrorMessage from '@/shared/utils/userMessage.ts';

import HeaderView from '../view/HeaderView.ts';

class HeaderModel {
  private navigation: NavigationModel;

  private parent: HTMLDivElement;

  private router: RouterModel;

  private view = new HeaderView();

  constructor(router: RouterModel, parent: HTMLDivElement) {
    this.parent = parent;
    this.router = router;
    this.navigation = new NavigationModel(this.router);
    this.init();
  }

  private checkAuthUser(): boolean {
    const { isUserLoggedIn } = getStore().getState();
    if (!isUserLoggedIn) {
      this.router.navigateTo(PAGE_ID.LOGIN_PAGE);
      return false;
    }
    return true;
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
    this.setProfileLinkHandler();
    this.setChangeLanguageCheckboxHandler();
  }

  private logoutHandler(): boolean {
    localStorage.clear();
    getStore().dispatch(setCurrentUser(null));
    getStore().dispatch(setAuthToken(null));
    getStore().dispatch(switchIsUserLoggedIn(false));
    getCustomerModel().logout();
    this.router.navigateTo(PAGE_ID.LOGIN_PAGE);
    return true;
  }

  private observeCurrentUser(): void {
    observeStore(selectIsUserLoggedIn, () => {
      this.checkCurrentUser();
    });
  }

  private setCartLinkHandler(): void {
    const logo = this.view.getToCartLink().getHTML();
    logo.addEventListener('click', (event) => {
      event.preventDefault();
      this.router.navigateTo(PAGE_ID.CART_PAGE);
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
          showErrorMessage();
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
      this.router.navigateTo(PAGE_ID.DEFAULT_PAGE);
    });
  }

  private setLogoutButtonHandler(): void {
    const logoutButton = this.view.getLogoutButton();
    logoutButton.getHTML().addEventListener('click', () => {
      try {
        this.logoutHandler();
      } catch {
        showErrorMessage();
      }
      logoutButton.setDisabled();
    });
  }

  private setProfileLinkHandler(): void {
    const logo = this.view.getToProfileLink().getHTML();
    logo.addEventListener('click', (event) => {
      event.preventDefault();
      // TBD remove unnecessary check (we don't show this logo when user is not logged in) ??
      if (this.checkAuthUser()) {
        this.router.navigateTo(PAGE_ID.USER_PROFILE_PAGE);
      }
    });
  }

  public getHTML(): HTMLElement {
    return this.view.getHTML();
  }
}
export default HeaderModel;
