import type RouterModel from '@/app/Router/model/RouterModel.ts';

import NavigationModel from '@/entities/Navigation/model/NavigationModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setCurrentLanguage, setCurrentUser } from '@/shared/Store/actions.ts';
import observeStore, { selectCurrentUser } from '@/shared/Store/observer.ts';
import { LANGUAGE_CHOICE } from '@/shared/constants/buttons.ts';
import { EVENT_NAME } from '@/shared/constants/events.ts';
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

  private logoutHandler(): boolean {
    localStorage.clear();
    getStore().dispatch(setCurrentUser(null));
    this.router.navigateTo(PAGE_ID.LOGIN_PAGE);
    return true;
  }

  private observeCurrentUser(): boolean {
    observeStore(selectCurrentUser, () => {
      this.checkCurrentUser();
    });
    return true;
  }

  private setChangeLanguageButtonHandler(): boolean {
    const changeLanguageButton = this.view.getChangeLanguageButton();
    changeLanguageButton.getHTML().addEventListener(EVENT_NAME.CLICK, () => {
      const { currentLanguage } = getStore().getState();
      const newLanguage = currentLanguage === LANGUAGE_CHOICE.EN ? LANGUAGE_CHOICE.RU : LANGUAGE_CHOICE.EN;
      changeLanguageButton.getHTML().innerText = newLanguage;
      getStore().dispatch(setCurrentLanguage(newLanguage));
    });
    return true;
  }

  private setLogoHandler(): boolean {
    const logo = this.view.getLinkLogo().getHTML();
    logo.addEventListener(EVENT_NAME.CLICK, (event) => {
      event.preventDefault();
      this.router.navigateTo(PAGE_ID.DEFAULT_PAGE);
    });
    return true;
  }

  private setLogoutButtonHandler(): boolean {
    const logoutButton = this.view.getLogoutButton();
    logoutButton.getHTML().addEventListener(EVENT_NAME.CLICK, () => {
      this.logoutHandler();
      logoutButton.setDisabled();
    });
    return true;
  }

  public getHTML(): HTMLElement {
    return this.view.getHTML();
  }
}
export default HeaderModel;
