import type { BreadCrumbLink } from '@/shared/types/link.ts';
import type { Page, PageParams } from '@/shared/types/page.ts';

import ProductInfoModel from '@/entities/ProductInfo/model/ProductInfoModel.ts';
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
    this.init(params).catch(showErrorMessage);
  }

  private createNavigationLinks(currentCategory: string, subcategory: string, categoryName: string): BreadCrumbLink[] {
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
        name: categoryName,
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

  private async init(params: PageParams): Promise<void> {
    const searchParams = new URLSearchParams(params.product?.searchParams ?? '');
    const category = searchParams.get(SEARCH_PARAMS_FIELD.CATEGORY) ?? '';
    const subcategory = searchParams.get(SEARCH_PARAMS_FIELD.SUBCATEGORY) ?? '';
    const currentSize = searchParams.get(SEARCH_PARAMS_FIELD.SIZE) ?? '';
    const categories = await getProductModel().getCategories();
    const currentCategory = categories?.find((item) => item.parent?.key === category)?.parent;
    const currentSubcategory = categories?.find((item) => item.key === subcategory);
    const links = this.createNavigationLinks(currentCategory?.id ?? '', subcategory, category);
    this.breadcrumbs = new BreadcrumbsModel(links);
    this.getHTML().append(this.breadcrumbs.getHTML());

    const products = await getProductModel().getProducts({ limit: 150 });
    const currentProduct = products.products.find((product) => product.key === params.product?.id);
    const productInfo = new ProductInfoModel({
      category: currentCategory ?? null,
      currentSize,
      description: currentProduct?.description ?? [],
      fullDescription: currentProduct?.fullDescription ?? [],
      images: currentProduct?.images ?? [],
      key: params.product?.id ?? '',
      name: currentProduct?.name ?? [],
      subcategory: currentSubcategory ?? null,
      variant: currentProduct?.variant ?? [],
    });

    this.getHTML().append(productInfo.getHTML());
    getStore().dispatch(setCurrentPage(PAGE_ID.PRODUCT_PAGE));
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default ProductPageModel;
