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

  private checkCurrentUser(): boolean {
    const { currentUser } = getStore().getState();
    const logoutButton = this.view.getLogoutButton();
    if (currentUser) {
      logoutButton.setEnabled();
    } else {
      logoutButton.setDisabled();
    }
    return true;
  }

  private init(): boolean {
    this.getHTML().append(this.navigation.getHTML());
    this.checkCurrentUser();
    this.setLogoHandler();
    this.observeCurrentUser();
    this.setLogoutButtonHandler();
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

  private setChangeLanguageButtonHandler(): boolean {
    const switchLanguageLogo = this.view.getswitchLanguageLogo();
    switchLanguageLogo.addEventListener('click', () => {
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

  public getHTML(): HTMLElement {
    return this.view.getHTML();
  }
}
export default HeaderModel;
