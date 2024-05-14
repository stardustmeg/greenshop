import type RouterModel from '@/app/Router/model/RouterModel.ts';

import NavigationModel from '@/entities/Navigation/model/NavigationModel.ts';
import getCustomerModel from '@/shared/API/customer/model/CustomerModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setCurrentLanguage, setCurrentUser, switchIsUserLoggedIn } from '@/shared/Store/actions.ts';
import observeStore, { selectIsUserLoggedIn } from '@/shared/Store/observer.ts';
import { LANGUAGE_CHOICE } from '@/shared/constants/common.ts';
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
    const { currentUser } = getStore().getState();
    if (!currentUser) {
      this.router.navigateTo(PAGE_ID.LOGIN_PAGE).catch(() => showErrorMessage());
      return false;
    }
    return true;
  }

  private checkCurrentUser(): boolean {
    const { currentUser } = getStore().getState();
    const logoutButton = this.view.getLogoutButton();
    if (currentUser) {
      this.view.getToProfileLink().setEnabled();
      logoutButton.setEnabled();
    } else {
      logoutButton.setDisabled();
      this.view.getToProfileLink().setDisabled();
    }
    return true;
  }

  private init(): boolean {
    this.view.getWrapper().append(this.navigation.getHTML());
    this.parent.insertAdjacentElement('beforebegin', this.view.getNavigationWrapper());
    this.checkCurrentUser();
    this.setLogoHandler();
    this.observeCurrentUser();
    this.setLogoutButtonHandler();
    this.setCartLinkHandler();
    this.setProfileLinkHandler();
    this.setChangeLanguageCheckboxHandler();
    return true;
  }

  private async logoutHandler(): Promise<boolean> {
    localStorage.clear();
    getStore().dispatch(setCurrentUser(null));
    getStore().dispatch(switchIsUserLoggedIn(false));
    try {
      getCustomerModel().logout();
      await this.router.navigateTo(PAGE_ID.LOGIN_PAGE);
    } catch {
      showErrorMessage();
    }
    return true;
  }

  private observeCurrentUser(): boolean {
    observeStore(selectIsUserLoggedIn, () => {
      this.checkCurrentUser();
    });
    return true;
  }

  private setCartLinkHandler(): boolean {
    const logo = this.view.getToCartLink().getHTML();
    logo.addEventListener('click', (event) => {
      event.preventDefault();
      this.router.navigateTo(PAGE_ID.CART_PAGE).catch(() => showErrorMessage());
    });
    return true;
  }

  private setChangeLanguageCheckboxHandler(): boolean {
    const switchLanguageCheckbox = this.view.getSwitchLanguageCheckbox().getHTML();
    switchLanguageCheckbox.addEventListener('click', () => {
      const {
        currentLanguage,
        // currentUser
      } = getStore().getState();
      const newLanguage = currentLanguage === LANGUAGE_CHOICE.EN ? LANGUAGE_CHOICE.RU : LANGUAGE_CHOICE.EN;
      try {
        // if (currentUser) {
        // const newLanguage = currentUser.locale === LANGUAGE_CHOICE.EN ? LANGUAGE_CHOICE.RU : LANGUAGE_CHOICE.EN;
        // const newUser = await getCustomerModel().editCustomer(
        //   [CustomerModel.actionSetLocale(newLanguage)],
        //   currentUser,
        // );
        // getStore().dispatch(setCurrentLanguage(newLanguage));
        // serverMessageModel.showServerMessage(SERVER_MESSAGE_KEYS.LANGUAGE_CHANGED, MESSAGE_STATUS.SUCCESS);
        // getStore().dispatch(setCurrentUser(newUser));
        // }
        getStore().dispatch(setCurrentLanguage(newLanguage));
      } catch {
        showErrorMessage();
      }
    });

    return true;
  }

  private setLogoHandler(): boolean {
    const logo = this.view.getLinkLogo().getHTML();
    logo.addEventListener('click', async (event) => {
      event.preventDefault();
      try {
        await this.router.navigateTo(PAGE_ID.DEFAULT_PAGE);
      } catch {
        showErrorMessage();
      }
    });
    return true;
  }

  private setLogoutButtonHandler(): boolean {
    const logoutButton = this.view.getLogoutButton();
    logoutButton.getHTML().addEventListener('click', async () => {
      try {
        await this.logoutHandler();
      } catch {
        showErrorMessage();
      }
      logoutButton.setDisabled();
    });
    return true;
  }

  private setProfileLinkHandler(): boolean {
    const logo = this.view.getToProfileLink().getHTML();
    logo.addEventListener('click', (event) => {
      event.preventDefault();
      // TBD remove unnecessary check (we don't show this logo when user is not logged in) ??
      if (this.checkAuthUser()) {
        this.router.navigateTo(PAGE_ID.USER_PROFILE_PAGE).catch(() => showErrorMessage());
      }
    });
    return true;
  }

  public getHTML(): HTMLElement {
    return this.view.getHTML();
  }
}
export default HeaderModel;
