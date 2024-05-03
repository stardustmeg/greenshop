import getStore from '@/shared/Store/Store.ts';
import { setBillingCountry, setShippingCountry } from '@/shared/Store/actions.ts';
import observeStore, { selectBillingCountry, selectShippingCountry } from '@/shared/Store/observer.ts';
import { EVENT_NAME } from '@/shared/constants/events.ts';
import { REGISTRATION_FORM_BILLING_ADDRESS_COUNTRY_FIELD_PARAMS } from '@/shared/constants/forms.ts';
import getCountryIndex from '@/shared/utils/getCountryIndex.ts';

import CountryChoiceView from '../view/CountryChoiceView.ts';

class CountryChoiceModel {
  private view: CountryChoiceView;

  constructor(input: HTMLInputElement) {
    this.view = new CountryChoiceView(input);
    this.setCountryItemsHandlers(input);
    this.setInputHandler(input);

    const action =
      input.id === REGISTRATION_FORM_BILLING_ADDRESS_COUNTRY_FIELD_PARAMS.inputParams.id
        ? selectBillingCountry
        : selectShippingCountry;

    observeStore(action, () => {
      const event = new Event(EVENT_NAME.INPUT);
      input.dispatchEvent(event);
    });
  }

  private setCountryItemsHandlers(input: HTMLInputElement): boolean {
    const inputHTML = input;
    this.view.getCountryItems().forEach((countryItem) => {
      const currentItem = countryItem;
      currentItem.addEventListener(EVENT_NAME.CLICK, () => {
        if (currentItem.textContent) {
          inputHTML.value = currentItem.textContent;
          this.setCountryToStore(currentItem, inputHTML.id);
          const event = new Event(EVENT_NAME.INPUT);
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

    const action =
      key === REGISTRATION_FORM_BILLING_ADDRESS_COUNTRY_FIELD_PARAMS.inputParams.id
        ? setBillingCountry
        : setShippingCountry;
    getStore().dispatch(action(currentCountryIndex));
    return true;
  }

  private setInputHandler(input: HTMLInputElement): boolean {
    input.addEventListener(EVENT_NAME.FOCUS, () => this.view.showCountryChoice());
    input.addEventListener(EVENT_NAME.INPUT, () => {
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
