import type { LanguageChoiceType } from '../constants/common.ts';

import getStore from '../Store/Store.ts';

const getCurrentLanguage = (): LanguageChoiceType => getStore().getState().currentLanguage;

export default getCurrentLanguage;
