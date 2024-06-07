import type { languageVariants } from '@/shared/types/common.ts';
import type { Category } from '@/shared/types/product.ts';

import getProductModel from '@/shared/API/product/model/ProductModel.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';
import * as buildPath from '@/shared/utils/buildPathname.ts';
import { showErrorMessage } from '@/shared/utils/userMessage.ts';

import FooterView from '../view/FooterView.ts';

export type Link = {
  href?: string;
  name: languageVariants;
};

const GENERAL_LINKS: Link[] = [
  {
    href: PAGE_ID.USER_PROFILE_PAGE,
    name: {
      en: 'My account',
      ru: 'Мой профиль',
    },
  },
  {
    href: PAGE_ID.ABOUT_US_PAGE,
    name: {
      en: 'About us',
      ru: 'О нас',
    },
  },
  {
    href: PAGE_ID.BLOG,
    name: {
      en: 'Blog',
      ru: 'Блог',
    },
  },
  {
    name: {
      en: 'Career',
      ru: 'Вакансии',
    },
  },
  {
    href: PAGE_ID.COOPERATION_PAGE,
    name: {
      en: 'Cooperation',
      ru: 'Сотрудничество',
    },
  },
];

const HELP_LINKS: Link[] = [
  {
    name: {
      en: 'Help Center',
      ru: 'Помощь',
    },
  },
  {
    name: {
      en: 'How to Buy',
      ru: 'Покупки',
    },
  },
  {
    name: {
      en: 'Delivery',
      ru: 'Доставка',
    },
  },
  {
    name: {
      en: 'Product Policy',
      ru: 'Политика',
    },
  },
  {
    name: {
      en: 'How to Return',
      ru: 'Возврат',
    },
  },
];

function generateRandomCategoryLink(categoriesArr: Category[]): Link[] {
  const subCategory = categoriesArr.filter((category) => category.parent !== null);
  const result: Link[] = [];
  for (let i = 0; i < 5; i += 1) {
    const randomIndex = Math.floor(Math.random() * subCategory.length);
    const category = subCategory[randomIndex];
    subCategory.splice(randomIndex, 1);
    result.push({
      href: buildPath.catalogPathWithIDAndQuery(null, { subcategory: [category.id] }),
      name: {
        en: category.name[0].value,
        ru: category.name[1].value,
      },
    });
  }
  return result;
}

class FooterModel {
  private view = new FooterView();

  constructor() {
    this.init().catch(showErrorMessage);
  }

  private async init(): Promise<boolean> {
    const categories: Category[] = await getProductModel().getCategories();
    const categoryLink: Link[] = generateRandomCategoryLink([...categories]);
    this.view.addNavLists(GENERAL_LINKS, HELP_LINKS, categoryLink);
    observeStore(selectCurrentLanguage, () => this.view.updateLanguage());
    return true;
  }

  public getHTML(): HTMLElement {
    return this.view.getHTML();
  }
}

export default FooterModel;
