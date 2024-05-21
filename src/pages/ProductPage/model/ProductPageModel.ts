import type { BreadCrumbLink } from '@/shared/types/link.ts';
import type { Page, PageParams } from '@/shared/types/page.ts';

import BreadcrumbsModel from '@/features/Breadcrumbs/model/BreadcrumbsModel.ts';
import getProductModel from '@/shared/API/product/model/ProductModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setCurrentPage } from '@/shared/Store/actions.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';
import { SEARCH_PARAMS_FIELD } from '@/shared/constants/product.ts';
import { buildPathName } from '@/shared/utils/buildPathname.ts';
import showErrorMessage from '@/shared/utils/userMessage.ts';

import ProductPageView from '../view/ProductPageView.ts';

class ProductPageModel implements Page {
  private breadcrumbs: BreadcrumbsModel | null = null;

  private view: ProductPageView;

  constructor(parent: HTMLDivElement, params: PageParams) {
    this.view = new ProductPageView(parent);
    this.init(params);
  }

  private async createNavigationLinks(params: PageParams): Promise<BreadCrumbLink[]> {
    const searchParams = new URLSearchParams(params.product?.searchParams ?? '');
    const category = searchParams.get(SEARCH_PARAMS_FIELD.CATEGORY) ?? '';
    const subcategory = searchParams.get(SEARCH_PARAMS_FIELD.SUBCATEGORY) ?? '';
    const categories = await getProductModel().getCategories();
    const currentCategory = categories?.find((item) => item.parent?.key === category)?.parent?.id;

    const links = [
      {
        link: `${buildPathName(PAGE_ID.MAIN_PAGE, null, null)}`,
        name: PAGE_ID.MAIN_PAGE.slice(0, -1),
      },
      {
        link: `${buildPathName(PAGE_ID.CATALOG_PAGE, null, null)}`,
        name: PAGE_ID.CATALOG_PAGE.slice(0, -1),
      },
    ];

    if (currentCategory) {
      links.push({
        link: `${buildPathName(PAGE_ID.CATALOG_PAGE, null, { category: [currentCategory] })}`,
        name: category,
      });
    }

    if (subcategory) {
      links.push({
        link: '',
        name: subcategory,
      });
    }

    return links;
  }

  private init(params: PageParams): void {
    this.createNavigationLinks(params)
      .then((links) => {
        this.breadcrumbs = new BreadcrumbsModel(links);
        this.getHTML().append(this.breadcrumbs.getHTML());
      })
      .catch(showErrorMessage);

    getStore().dispatch(setCurrentPage(PAGE_ID.PRODUCT_PAGE));
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default ProductPageModel;
