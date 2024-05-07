import getStore from '@/shared/Store/Store.ts';
import { setBillingCountry, setShippingCountry } from '@/shared/Store/actions.ts';
import observeStore, {
  selectBillingCountry,
  selectCurrentLanguage,
  selectShippingCountry,
} from '@/shared/Store/observer.ts';
import COUNTRIES_LIST from '@/shared/constants/countriesList.ts';
import { BILLING_ADDRESS_COUNTRY } from '@/shared/constants/forms/register/fieldParams.ts';
import getCountryIndex from '@/shared/utils/getCountryIndex.ts';

import CountryChoiceView from '../view/CountryChoiceView.ts';

class CountryChoiceModel {
  private view: CountryChoiceView;

  constructor(input: HTMLInputElement) {
    this.view = new CountryChoiceView(input);
    this.setCountryItemsHandlers(input);
    this.setInputHandler(input);

    const action = input.id === BILLING_ADDRESS_COUNTRY.inputParams.id ? selectBillingCountry : selectShippingCountry;

    observeStore(action, () => {
      const event = new Event('input');
      input.dispatchEvent(event);
    });
  }

  private observeCurrentLanguage(item: HTMLDivElement): boolean {
    observeStore(selectCurrentLanguage, () => {
      const currentItem = item;
      const currentCountriesList = COUNTRIES_LIST[getStore().getState().currentLanguage];
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
          this.setCountryToStore(currentItem, inputHTML.id);
          const event = new Event('input');
          inputHTML.dispatchEvent(event);
          this.view.hideCountryChoice();
        }
      });
    });
    return true;
  }

  private setCountryToStore(element: HTMLDivElement | HTMLInputElement, key: string): boolean {
    const currentCountryIndex = getCountryIndex(
      element instanceof HTMLDivElement ? element.textContent || '' : element.value,
    );

    const action = key === BILLING_ADDRESS_COUNTRY.inputParams.id ? setBillingCountry : setShippingCountry;
    getStore().dispatch(action(currentCountryIndex));
    return true;
  }

  private setInputHandler(input: HTMLInputElement): boolean {
    input.addEventListener('focus', () => this.view.showCountryChoice());
    input.addEventListener('input', () => {
      this.view.switchVisibilityCountryItems(input);
      this.setCountryToStore(input, input.id);
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
