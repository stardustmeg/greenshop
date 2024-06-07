import type { BreadcrumbLink } from '@/shared/types/link.ts';
import type { Page, PageParams } from '@/shared/types/page.ts';
import type { Product, localization } from '@/shared/types/product.ts';

import RouterModel from '@/app/Router/model/RouterModel.ts';
import BreadcrumbsModel from '@/features/Breadcrumbs/model/BreadcrumbsModel.ts';
import getProductModel from '@/shared/API/product/model/ProductModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setCurrentPage } from '@/shared/Store/actions.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { LANGUAGE_CHOICE } from '@/shared/constants/common.ts';
import { PAGE_ID, PAGE_TITLE } from '@/shared/constants/pages.ts';
import { SEARCH_PARAMS_FIELD } from '@/shared/constants/product.ts';
import * as buildPath from '@/shared/utils/buildPathname.ts';
import { showErrorMessage } from '@/shared/utils/userMessage.ts';
import ProductInfoModel from '@/widgets/ProductInfo/model/ProductInfoModel.ts';

import ProductPageView from '../view/ProductPageView.ts';

class ProductPageModel implements Page {
  private currentProduct: Product | null = null;

  private view: ProductPageView;

  constructor(parent: HTMLDivElement, params: PageParams) {
    this.view = new ProductPageView(parent);
    this.init(params);
  }

  private createBreadcrumbLinks(currentProduct: Product): BreadcrumbLink[] {
    const category = currentProduct.category[0].parent;
    const subcategory = currentProduct.category[0];
    const links: BreadcrumbLink[] = [
      { link: PAGE_ID.MAIN_PAGE, name: PAGE_TITLE[getStore().getState().currentLanguage].main },
      { link: PAGE_ID.CATALOG_PAGE, name: PAGE_TITLE[getStore().getState().currentLanguage].catalog },
    ];

    if (category) {
      links.push({
        link: buildPath.catalogPathWithIDAndQuery(null, { category: [category.id] }),
        name: category.name[Number(getStore().getState().currentLanguage === LANGUAGE_CHOICE.RU)].value,
      });
    }

    if (subcategory && category) {
      links.push({
        link: buildPath.catalogPathWithIDAndQuery(null, { category: [category.id], subcategory: [subcategory.id] }),
        name: subcategory.name[Number(getStore().getState().currentLanguage === LANGUAGE_CHOICE.RU)].value,
      });
    }

    return links;
  }

  private init(params: PageParams): void {
    const currentSize = RouterModel.getSearchParams().get(SEARCH_PARAMS_FIELD.SIZE);

    getProductModel()
      .getProductByKey(params.product?.id ?? '')
      .then((productData) => {
        if (productData) {
          this.currentProduct = productData;
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
    const breadcrumbs = new BreadcrumbsModel();
    breadcrumbs.addBreadcrumbLinks(this.createBreadcrumbLinks(currentProduct));
    const breadcrumbsContainer = this.view.getBreadcrumbsContainer();

    if (breadcrumbsContainer) {
      while (breadcrumbsContainer.firstChild) {
        breadcrumbsContainer.removeChild(breadcrumbsContainer.firstChild);
      }
      breadcrumbsContainer.appendChild(breadcrumbs.getHTML());
    }
  }

  private observeLanguage(fullDescription: localization[]): void {
    observeStore(selectCurrentLanguage, () => {
      const language = getStore().getState().currentLanguage;
      this.view.setFullDescription(fullDescription[Number(language === LANGUAGE_CHOICE.RU)].value);
      if (this.currentProduct) {
        this.initBreadcrumbs(this.currentProduct);
      }
    });
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default ProductPageModel;
