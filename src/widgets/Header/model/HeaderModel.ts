import type RouterModel from '@/app/Router/model/RouterModel.ts';

import NavigationModel from '@/entities/Navigation/model/NavigationModel.ts';
import getCustomerModel from '@/shared/API/customer/model/CustomerModel.ts';
import serverMessageModel from '@/shared/ServerMessage/model/ServerMessageModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setCurrentLanguage, setCurrentUser } from '@/shared/Store/actions.ts';
import observeStore, { selectCurrentUser } from '@/shared/Store/observer.ts';
import { LANGUAGE_CHOICE } from '@/shared/constants/buttons.ts';
import { MESSAGE_STATUS, SERVER_MESSAGE } from '@/shared/constants/messages.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';

import HeaderView from '../view/HeaderView.ts';

class HeaderModel {
  private navigation: NavigationModel;

  private router: RouterModel;

  private view = new HeaderView();

  constructor(router: RouterModel) {
    this.router = router;
    this.navigation = new NavigationModel(this.router);
    this.init();
  }

  private checkAuthUser(): boolean {
    const { currentUser } = getStore().getState();
    if (!currentUser) {
      this.router
        .navigateTo(PAGE_ID.LOGIN_PAGE)
        .catch(() =>
          serverMessageModel.showServerMessage(
            SERVER_MESSAGE[getStore().getState().currentLanguage].BAD_REQUEST,
            MESSAGE_STATUS.ERROR,
          ),
        );
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
    this.checkCurrentUser();
    this.setLogoHandler();
    this.observeCurrentUser();
    this.setLogoutButtonHandler();
    this.setCartLinkHandler();
    this.setProfileLinkHandler();
    this.setChangeLanguageButtonHandler();
    return true;
  }

  private async logoutHandler(): Promise<boolean> {
    localStorage.clear();
    getStore().dispatch(setCurrentUser(null));
    try {
      getCustomerModel().logout();
      await this.router.navigateTo(PAGE_ID.LOGIN_PAGE);
    } catch {
      serverMessageModel.showServerMessage(
        SERVER_MESSAGE[getStore().getState().currentLanguage].BAD_REQUEST,
        MESSAGE_STATUS.ERROR,
      );
    }
    return true;
  }

  private observeCurrentUser(): boolean {
    observeStore(selectCurrentUser, () => {
      this.checkCurrentUser();
    });
    return true;
  }

  private setCartLinkHandler(): boolean {
    const logo = this.view.getToCartLink().getHTML();
    logo.addEventListener('click', async (event) => {
      event.preventDefault();
      try {
        await this.router.navigateTo(PAGE_ID.CART_PAGE);
      } catch {
        serverMessageModel.showServerMessage(
          SERVER_MESSAGE[getStore().getState().currentLanguage].BAD_REQUEST,
          MESSAGE_STATUS.ERROR,
        );
      }
    });
    return true;
  }

  private setChangeLanguageButtonHandler(): boolean {
    const switchLanguageButton = this.view.getSwitchLanguageButton().getHTML();
    switchLanguageButton.addEventListener('click', () => {
      const newLanguage =
        getStore().getState().currentLanguage === LANGUAGE_CHOICE.EN ? LANGUAGE_CHOICE.RU : LANGUAGE_CHOICE.EN;
      getStore().dispatch(setCurrentLanguage(newLanguage));
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
        serverMessageModel.showServerMessage(
          SERVER_MESSAGE[getStore().getState().currentLanguage].BAD_REQUEST,
          MESSAGE_STATUS.ERROR,
        );
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
        serverMessageModel.showServerMessage(
          SERVER_MESSAGE[getStore().getState().currentLanguage].BAD_REQUEST,
          MESSAGE_STATUS.ERROR,
        );
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
        this.router.navigateTo(PAGE_ID.USER_PROFILE_PAGE).catch(() => {
          serverMessageModel.showServerMessage(
            SERVER_MESSAGE[getStore().getState().currentLanguage].BAD_REQUEST,
            MESSAGE_STATUS.ERROR,
          );
        });
      }
    });
    return true;
  }

  public getHTML(): HTMLElement {
    return this.view.getHTML();
  }
}
export default HeaderModel;
