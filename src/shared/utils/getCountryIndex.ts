import COUNTRIES_LIST from '../constants/countriesList.ts';

export default function getCountryIndex(country: string): string {
  const countryIndex: string = COUNTRIES_LIST[country];
  return countryIndex;
}
