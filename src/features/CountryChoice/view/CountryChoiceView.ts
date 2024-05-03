import { COUNTRIES, EVENT_NAMES, TAG_NAMES } from '@/shared/constants/enums.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import styles from './countryChoiceView.module.scss';

class CountryChoiceView {
  private countryChoice: HTMLDivElement;

  private countryDropList: HTMLDivElement;

  private countryItems: HTMLDivElement[] = [];

  constructor(input: HTMLInputElement) {
    this.countryDropList = this.createCountryDropList();
    this.countryChoice = this.createHTML();

    // TBD replace node document with some element because listener works two times (twice)
    document.addEventListener(EVENT_NAMES.CLICK, (event) => {
      if (!this.countryDropList.classList.contains(styles.hidden) && event.target !== input) {
        this.hideCountryChoice();
      }
    });
  }

  private createCountryDropList(): HTMLDivElement {
    this.countryDropList = createBaseElement({
      cssClasses: [styles.countryDropList],
      tag: TAG_NAMES.DIV,
    });

    Object.entries(COUNTRIES).forEach(([countryCode]) =>
      this.countryDropList.append(this.createCountryItem(countryCode)),
    );

    return this.countryDropList;
  }

  private createCountryItem(countryCode: string): HTMLDivElement {
    const countryItem = createBaseElement({
      cssClasses: [styles.countryItem],
      innerContent: countryCode,
      tag: TAG_NAMES.DIV,
    });

    this.countryItems.push(countryItem);

    return countryItem;
  }

  private createHTML(): HTMLDivElement {
    this.countryChoice = createBaseElement({
      cssClasses: [styles.countryChoice, styles.hidden],
      tag: TAG_NAMES.DIV,
    });

    this.countryChoice.append(this.countryDropList);

    return this.countryChoice;
  }

  public getCountryDropList(): HTMLDivElement {
    return this.countryDropList;
  }

  public getCountryItems(): HTMLDivElement[] {
    return this.countryItems;
  }

  public getHTML(): HTMLDivElement {
    return this.countryChoice;
  }

  public hideCountryChoice(): void {
    this.countryChoice.classList.add(styles.hidden);
    document.body.classList.remove(styles.stopScroll);
  }

  public showCountryChoice(): void {
    this.countryChoice.classList.remove(styles.hidden);
    document.body.classList.add(styles.stopScroll);
  }

  public switchVisibilityCountryItems(inputHTML: HTMLInputElement): boolean {
    const filterValue = inputHTML.value.toLowerCase();
    this.countryItems.forEach((countryItem) => {
      const itemValue = countryItem.textContent?.toLowerCase();
      countryItem.classList.toggle(styles.hidden, !itemValue?.includes(filterValue));
    });

    return true;
  }
}

export default CountryChoiceView;
