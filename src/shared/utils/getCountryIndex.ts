import getStore from '../Store/Store.ts';
import COUNTRIES_LIST from '../constants/countriesList.ts';

export default function getCountryIndex(country: string): string {
  const { currentLanguage } = getStore().getState();
  const countryIndex: string = COUNTRIES_LIST[currentLanguage][country];
  return countryIndex;
}
