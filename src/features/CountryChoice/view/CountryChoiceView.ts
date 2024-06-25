import COUNTRIES_LIST from '@/shared/constants/countriesList.ts';
import KEYBOARD_KEY from '@/shared/constants/keyboard.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import getCurrentLanguage from '@/shared/utils/getCurrentLanguage.ts';

import styles from './countryChoiceView.module.scss';

class CountryChoiceView {
  private countryChoice: HTMLDivElement;

  private countryDropList: HTMLDivElement;

  private countryItems: HTMLDivElement[] = [];

  constructor(input: HTMLInputElement) {
    this.countryDropList = this.createCountryDropList();
    this.countryChoice = this.createHTML();

    document.addEventListener('click', (event) => {
      if (!this.countryDropList.classList.contains(styles.hidden) && event.target !== input) {
        this.hideCountryChoice();
      } else {
        this.showCountryChoice();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === KEYBOARD_KEY.TAB && !this.getHTML().classList.contains(styles.hidden)) {
        this.hideCountryChoice();
      }
    });
  }

  private createCountryDropList(): HTMLDivElement {
    this.countryDropList = createBaseElement({
      cssClasses: [styles.countryDropList],
      tag: 'div',
    });

    Object.entries(COUNTRIES_LIST[getCurrentLanguage()]).forEach(([countryName, countryCode]) =>
      this.countryDropList.append(this.createCountryItem(countryName, countryCode)),
    );

    return this.countryDropList;
  }

  private createCountryItem(countryName: string, countryCode: string): HTMLDivElement {
    const countryItem = createBaseElement({
      attributes: { id: countryCode },
      cssClasses: [styles.countryItem],
      innerContent: countryName,
      tag: 'div',
    });

    this.countryItems.push(countryItem);

    return countryItem;
  }

  private createHTML(): HTMLDivElement {
    this.countryChoice = createBaseElement({
      cssClasses: [styles.countryChoice, styles.hidden],
      tag: 'div',
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
