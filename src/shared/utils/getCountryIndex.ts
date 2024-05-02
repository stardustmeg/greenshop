import { COUNTRIES } from '../constants/enums.ts';

export default function getCountryIndex(country: string): string {
  const countryIndex: string = COUNTRIES[country];
  return countryIndex;
}
