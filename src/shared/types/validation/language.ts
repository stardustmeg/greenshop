import type { LanguageChoiceType } from '@/shared/constants/common';

import { LANGUAGE_CHOICE } from '@/shared/constants/common.ts';

const isLanguageChoiceType = (locale: string): locale is LanguageChoiceType =>
  locale === LANGUAGE_CHOICE.EN || locale === LANGUAGE_CHOICE.RU;

export default isLanguageChoiceType;
