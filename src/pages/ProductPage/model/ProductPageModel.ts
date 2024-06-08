import type { BreadcrumbLink } from '@/shared/types/link.ts';
import type { Page, PageParams } from '@/shared/types/page.ts';
import type { Product, localization } from '@/shared/types/product.ts';

import RouterModel from '@/app/Router/model/RouterModel.ts';
import BreadcrumbsModel from '@/features/Breadcrumbs/model/BreadcrumbsModel.ts';
import getProductModel from '@/shared/API/product/model/ProductModel.ts';
import LoaderModel from '@/shared/Loader/model/LoaderModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setCurrentPage } from '@/shared/Store/actions.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { LANGUAGE_CHOICE } from '@/shared/constants/common.ts';
import { PAGE_ID, PAGE_TITLE } from '@/shared/constants/pages.ts';
import { SEARCH_PARAMS_FIELD } from '@/shared/constants/product.ts';
import { LOADER_SIZE } from '@/shared/constants/sizes.ts';
import * as buildPath from '@/shared/utils/buildPathname.ts';
import { showErrorMessage } from '@/shared/utils/userMessage.ts';
import ProductInfoModel from '@/widgets/ProductInfo/model/ProductInfoModel.ts';

import ProductPageView from '../view/ProductPageView.ts';

class ProductPageModel implements Page {
  private breadcrumbs = new BreadcrumbsModel();

  private currentProduct: Product | null = null;

  private view: ProductPageView;

  constructor(parent: HTMLDivElement, params: PageParams) {
    this.view = new ProductPageView(parent);
    this.init(params);
  }

  private createBreadcrumbLinks(currentProduct: Product | null): BreadcrumbLink[] {
    const { currentLanguage } = getStore().getState();
    const isRuLanguage = currentLanguage === LANGUAGE_CHOICE.RU;
    const category = currentProduct?.category[0].parent;
    const subcategory = currentProduct?.category[0];

    const links: BreadcrumbLink[] = [
      { link: PAGE_ID.MAIN_PAGE, name: PAGE_TITLE[currentLanguage].main },
      { link: PAGE_ID.CATALOG_PAGE, name: PAGE_TITLE[currentLanguage].catalog },
    ];

    if (category) {
      links.push({
        link: buildPath.catalogPathWithIDAndQuery(null, { category: [category.id] }),
        name: category.name[Number(isRuLanguage)].value,
      });
    }

    if (subcategory && category) {
      links.push({
        link: buildPath.catalogPathWithIDAndQuery(null, { category: [category.id], subcategory: [subcategory.id] }),
        name: subcategory.name[Number(isRuLanguage)].value,
      });
    }

    return links;
  }

  private init(params: PageParams): void {
    const currentSize = RouterModel.getSearchParams().get(SEARCH_PARAMS_FIELD.SIZE);
    const loader = new LoaderModel(LOADER_SIZE.EXTRA_LARGE).getHTML();
    this.view.getHTML().append(loader);
    getProductModel()
      .getProductByKey(params.product?.id ?? '')
      .then((productData) => {
        if (productData) {
          this.updatePageContent(productData, currentSize);
        }
      })
      .catch(showErrorMessage)
      .finally(() => loader.remove());

    getStore().dispatch(setCurrentPage(PAGE_ID.PRODUCT_PAGE));
  }

  private initBreadcrumbs(): void {
    this.breadcrumbs.clearBreadcrumbLinks();
    this.breadcrumbs.addBreadcrumbLinks(this.createBreadcrumbLinks(this.currentProduct));
    this.view.getHTML().prepend(this.breadcrumbs.getHTML());
  }

  private observeLanguage(fullDescription: localization[]): void {
    observeStore(selectCurrentLanguage, () => {
      this.view.setFullDescription(
        fullDescription[Number(getStore().getState().currentLanguage === LANGUAGE_CHOICE.RU)].value,
      );
      this.initBreadcrumbs();
    });
  }

  private updatePageContent(productData: Product, currentSize: null | string): void {
    this.currentProduct = productData;
    this.initBreadcrumbs();

    const productInfo = new ProductInfoModel({
      currentSize: currentSize ?? this.currentProduct.variant[0].size,
      ...this.currentProduct,
    });
    this.getHTML().append(productInfo.getHTML(), this.view.getFullDescriptionWrapper());
    this.view.setFullDescription(
      this.currentProduct.fullDescription[Number(getStore().getState().currentLanguage === LANGUAGE_CHOICE.RU)].value,
    );
    this.observeLanguage(this.currentProduct.fullDescription);
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default ProductPageModel;
