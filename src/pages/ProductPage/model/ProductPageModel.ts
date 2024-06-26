import type { BreadcrumbLink } from '@/shared/types/link.ts';
import type { Page } from '@/shared/types/page.ts';
import type { Product, localization } from '@/shared/types/product.ts';

import RouterModel from '@/app/Router/model/RouterModel.ts';
import BreadcrumbsModel from '@/features/Breadcrumbs/model/BreadcrumbsModel.ts';
import getProductModel from '@/shared/API/product/model/ProductModel.ts';
import LoaderModel from '@/shared/Loader/model/LoaderModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setCurrentPage } from '@/shared/Store/actions.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { PAGE_ID, PAGE_TITLE } from '@/shared/constants/pages.ts';
import { SEARCH_PARAMS_FIELD } from '@/shared/constants/product.ts';
import { LOADER_SIZE } from '@/shared/constants/sizes.ts';
import * as buildPath from '@/shared/utils/buildPathname.ts';
import getCurrentLanguage from '@/shared/utils/getCurrentLanguage.ts';
import getLanguageValue from '@/shared/utils/getLanguageValue.ts';
import { showErrorMessage } from '@/shared/utils/userMessage.ts';
import ProductInfoModel from '@/widgets/ProductInfo/model/ProductInfoModel.ts';

import ProductPageView from '../view/ProductPageView.ts';

class ProductPageModel implements Page {
  private breadcrumbs = new BreadcrumbsModel();

  private currentProduct: Product | null = null;

  private view: ProductPageView;

  constructor(parent: HTMLDivElement) {
    this.view = new ProductPageView(parent);
    this.init();
  }

  private createBreadcrumbLinks(currentProduct: Product | null): BreadcrumbLink[] {
    const currentLanguage = getCurrentLanguage();
    const category = currentProduct?.category[0].parent;
    const subcategory = currentProduct?.category[0];

    const links: BreadcrumbLink[] = [
      { link: PAGE_ID.MAIN_PAGE, name: PAGE_TITLE[currentLanguage].main },
      { link: PAGE_ID.CATALOG_PAGE, name: PAGE_TITLE[currentLanguage].catalog },
    ];

    if (category) {
      links.push({
        link: buildPath.catalogPathWithQuery({ category: [category.key] }),
        name: getLanguageValue(category.name),
      });
    }

    if (subcategory && category) {
      links.push({
        link: buildPath.catalogPathWithQuery({ subcategory: [subcategory.key] }),
        name: getLanguageValue(subcategory.name),
      });
    }

    return links;
  }

  private init(): void {
    const currentSize = RouterModel.getSearchParams().get(SEARCH_PARAMS_FIELD.SIZE);
    const loader = new LoaderModel(LOADER_SIZE.EXTRA_LARGE).getHTML();
    this.view.getHTML().append(loader);
    getProductModel()
      .getProductByKey(RouterModel.getPageID() ?? '')
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
      this.view.setFullDescription(getLanguageValue(fullDescription));
      this.initBreadcrumbs();
    });
  }

  private updatePageContent(productData: Product, currentSize: null | string): void {
    this.currentProduct = productData;
    this.initBreadcrumbs();

    const productPath = buildPath.productPathWithIDAndQuery(RouterModel.getPageID(), {
      size: [currentSize],
      slide: [RouterModel.getSearchParams().get(SEARCH_PARAMS_FIELD.SLIDE) || '0'],
    });

    const savedPath =
      RouterModel.getSavedPath() === productPath ? RouterModel.getCurrentPage() : RouterModel.getSavedPath();

    const productInfo = new ProductInfoModel(
      {
        currentSize: currentSize ?? productData.variant[0].size,
        ...productData,
      },
      savedPath,
    );
    this.getHTML().append(productInfo.getHTML(), this.view.getFullDescriptionWrapper());
    this.view.setFullDescription(getLanguageValue(this.currentProduct.fullDescription));
    this.observeLanguage(this.currentProduct.fullDescription);
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default ProductPageModel;
