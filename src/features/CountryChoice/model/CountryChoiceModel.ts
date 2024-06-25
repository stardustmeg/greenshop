import getStore from '@/shared/Store/Store.ts';
import { setBillingCountry, setDefaultCountry, setShippingCountry } from '@/shared/Store/actions.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { DATA_KEY } from '@/shared/constants/common.ts';
import COUNTRIES_LIST from '@/shared/constants/countriesList.ts';
import { USER_ADDRESS } from '@/shared/constants/forms.ts';
import formattedText from '@/shared/utils/formattedText.ts';
import getCountryIndex from '@/shared/utils/getCountryIndex.ts';
import getCurrentLanguage from '@/shared/utils/getCurrentLanguage.ts';

import CountryChoiceView from '../view/CountryChoiceView.ts';

class CountryChoiceModel {
  private view: CountryChoiceView;

  constructor(input: HTMLInputElement) {
    this.view = new CountryChoiceView(input);
    this.setCountryItemsHandlers(input);
    this.setInputHandler(input);
  }

  private observeCurrentLanguage(item: HTMLDivElement): boolean {
    observeStore(selectCurrentLanguage, () => {
      const currentItem = item;
      const currentCountriesList = COUNTRIES_LIST[getCurrentLanguage()];
      Object.entries(currentCountriesList).forEach(([countryName, countryCode]) => {
        if (countryCode === currentItem.id) {
          currentItem.textContent = countryName;
        }
      });
    });
    return true;
  }

  private setCountryItemsHandlers(input: HTMLInputElement): boolean {
    const inputHTML = input;
    this.view.getCountryItems().forEach((countryItem) => {
      const currentItem = countryItem;
      this.observeCurrentLanguage(currentItem);
      currentItem.addEventListener('click', () => {
        if (currentItem.textContent) {
          inputHTML.value = currentItem.textContent;
          this.setCountryToStore(currentItem, inputHTML.getAttribute(DATA_KEY.ADDRESS) ?? '');
          const event = new Event('input');
          input.dispatchEvent(event);
          this.view.hideCountryChoice();
        }
      });
    });
    return true;
  }

  private setCountryToStore(element: HTMLDivElement | HTMLInputElement, key: string): boolean {
    const currentCountryIndex = getCountryIndex(
      element instanceof HTMLDivElement ? formattedText(element.textContent ?? '') : formattedText(element.value),
    );

    let action;

    switch (key) {
      case USER_ADDRESS.BILLING:
        action = setBillingCountry;
        break;
      case USER_ADDRESS.SHIPPING:
        action = setShippingCountry;
        break;
      default:
        action = setDefaultCountry;
        break;
    }

    getStore().dispatch(action(currentCountryIndex));
    return true;
  }

  private setInputHandler(input: HTMLInputElement): boolean {
    input.addEventListener('focus', () => this.view.showCountryChoice());
    input.addEventListener('input', () => {
      this.view.switchVisibilityCountryItems(input);
      this.setCountryToStore(input, input.getAttribute(DATA_KEY.ADDRESS) ?? '');
    });
    return true;
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }

  public getView(): CountryChoiceView {
    return this.view;
  }
}

export default CountryChoiceModel;
