import type { BreadCrumbLink } from '@/shared/types/link.ts';
import type { Page, PageParams } from '@/shared/types/page.ts';
import type { Product, localization } from '@/shared/types/product.ts';

import ProductInfoModel from '@/entities/ProductInfo/model/ProductInfoModel.ts';
import BreadcrumbsModel from '@/features/Breadcrumbs/model/BreadcrumbsModel.ts';
import getProductModel from '@/shared/API/product/model/ProductModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setCurrentPage } from '@/shared/Store/actions.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { LANGUAGE_CHOICE } from '@/shared/constants/common.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';
import { SEARCH_PARAMS_FIELD } from '@/shared/constants/product.ts';
import { buildPathName } from '@/shared/utils/buildPathname.ts';
import showErrorMessage from '@/shared/utils/userMessage.ts';

import ProductPageView from '../view/ProductPageView.ts';

class ProductPageModel implements Page {
  private view: ProductPageView;

  constructor(parent: HTMLDivElement, params: PageParams) {
    this.view = new ProductPageView(parent);
    this.init(params);
  }

  private createNavigationLinks(currentProduct: Product): BreadCrumbLink[] {
    const category = currentProduct.category[0].parent;
    const subcategory = currentProduct.category[0];
    const links = [
      {
        link: buildPathName(PAGE_ID.MAIN_PAGE, null, null),
        name: PAGE_ID.MAIN_PAGE.slice(0, -1),
      },
      {
        link: buildPathName(PAGE_ID.CATALOG_PAGE, null, null),
        name: PAGE_ID.CATALOG_PAGE.slice(0, -1),
      },
    ];

    if (category) {
      links.push({
        link: buildPathName(PAGE_ID.CATALOG_PAGE, null, { category: [category.id] }),

        name: category.name[0].value,
      });
    }

    if (subcategory) {
      links.push({
        link: '',
        name: subcategory.name[0].value,
      });
    }

    return links;
  }

  private init(params: PageParams): void {
    const searchParams = new URLSearchParams(params.product?.searchParams);
    const currentSize = searchParams.get(SEARCH_PARAMS_FIELD.SIZE);

    getProductModel()
      .getProductByKey(params.product?.id ?? '')
      .then((productData) => {
        if (productData) {
          const productInfo = new ProductInfoModel({
            currentSize: currentSize ?? productData.variant[0].size,
            ...productData,
          });
          this.initBreadcrumbs(productData);
          this.getHTML().append(productInfo.getHTML(), this.view.getFullDescriptionWrapper());
          this.view.setFullDescription(
            productData.fullDescription[Number(getStore().getState().currentLanguage === LANGUAGE_CHOICE.RU)].value,
          );
          this.observeLanguage(productData.fullDescription);
        }
      })
      .catch(showErrorMessage);

    getStore().dispatch(setCurrentPage(PAGE_ID.PRODUCT_PAGE));
  }

  private initBreadcrumbs(currentProduct: Product): void {
    const links = this.createNavigationLinks(currentProduct);
    this.getHTML().append(new BreadcrumbsModel(links).getHTML());
  }

  private observeLanguage(fullDescription: localization[]): void {
    observeStore(selectCurrentLanguage, () => {
      this.view.setFullDescription(
        fullDescription[Number(getStore().getState().currentLanguage === LANGUAGE_CHOICE.RU)].value,
      );
    });
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default ProductPageModel;
