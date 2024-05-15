import { LANGUAGE_CHOICE, type LanguageChoiceType } from '../constants/common.ts';
import COUNTRIES_LIST from '../constants/countriesList.ts';

export const checkInputLanguage = (text: string): LanguageChoiceType =>
  /[a-zA-Z]/.test(text) ? LANGUAGE_CHOICE.EN : LANGUAGE_CHOICE.RU;

export default function getCountryIndex(country: string): string {
  const currentLanguage = checkInputLanguage(country);
  const countryIndex: string = COUNTRIES_LIST[currentLanguage][country];
  return countryIndex;
}
