import type { LanguageChoiceType } from '../constants/common.ts';
import type { localization } from '../types/product.ts';

import getCurrentLanguage from './getCurrentLanguage.ts';

function getLanguageValue(variants: localization[], language?: LanguageChoiceType): string {
  const currentLanguage = language || getCurrentLanguage();
  const variant = variants.find((item) => item.language === currentLanguage);
  return variant?.value || '';
}

export default getLanguageValue;
