import type { Category, Product, Size, localization } from '@/shared/types/product.ts';
import type {
  CategoryPagedQueryResponse,
  CategoryReference,
  ClientResponse,
  LocalizedString,
  ProductPagedQueryResponse,
  Product as ProductResponse,
} from '@commercetools/platform-sdk';

import getStore from '@/shared/Store/Store.ts';
import { setCategories, setProducts } from '@/shared/Store/actions.ts';
import getSize from '@/shared/utils/size.ts';

import getRoot, { type RootApi } from '../../sdk/root.ts';
import {
  isAttributePlainEnumValue,
  isCategoryPagedQueryResponse,
  isClientResponse,
  isLocalizationObj,
  isProductPagedQueryResponse,
  isProductResponse,
} from '../../types/validation.ts';

export class ProductModel {
  private root: RootApi;

  constructor() {
    this.root = getRoot();
  }

  private adaptCategoryPagedQueryToClient(data: CategoryPagedQueryResponse): Category[] {
    const response = data.results.map((category) => {
      const result: Category = {
        id: category.id || '',
        key: category.key || '',
        name: [],
      };
      Object.entries(category.name).forEach(([language, value]) => {
        result.name.push({
          language,
          value,
        });
      });

      return result;
    });

    return response;
  }

  private adaptCategoryReference(data: CategoryReference[]): Category[] {
    const categoryList = getStore().getState().categories;
    const response: Category[] = [];
    data.forEach((category) => {
      const categoryEl = categoryList.find((el) => el.id === category.id);
      if (categoryEl) {
        response.push(categoryEl);
      }
    });
    return response;
  }

  private adaptLocalizationValue(data: LocalizedString | undefined): localization[] {
    const result: localization[] = [];
    Object.entries(data || {}).forEach(([language, value]) => {
      result.push({
        language,
        value,
      });
    });
    return result;
  }

  private adaptProductPagedQueryToClient(data: ProductPagedQueryResponse): Product[] {
    const response = data.results.map((product) => this.adaptProductToClient(product));
    return response;
  }

  private adaptProductToClient(product: ProductResponse): Product {
    const result: Product = {
      category: [],
      description: [],
      fullDescription: [],
      id: product.id || '',
      images: [],
      key: product.key || '',
      name: [],
      variant: [],
    };
    result.category.push(...this.adaptCategoryReference(product.masterData.staged.categories));
    result.description.push(...this.adaptLocalizationValue(product.masterData.staged.description));
    result.name.push(...this.adaptLocalizationValue(product.masterData.staged.name));

    Object.assign(result, this.adaptVariants(result, product));

    result.fullDescription = [...new Set(result.fullDescription)];
    result.variant = [...new Set(result.variant)];
    result.images = [...new Set(result.images)];

    return result;
  }

  private adaptVariants(product: Product, response: ProductResponse): Product {
    response.masterData.staged.variants.forEach((variant) => {
      let price = 0;
      let size: Size | null = null;

      if (variant.prices && variant.prices.length) {
        price = variant.prices[0].value.centAmount;
      }

      if (variant.attributes && variant.attributes.length) {
        variant.attributes.forEach((attribute) => {
          if (attribute.name === 'full_description' && isLocalizationObj(attribute.value)) {
            product.fullDescription.push(...this.adaptLocalizationValue(attribute.value));
          }
          if (
            attribute.name === 'size' &&
            Array.isArray(attribute.value) &&
            attribute.value.length &&
            isAttributePlainEnumValue(attribute.value[0])
          ) {
            size = getSize(attribute.value[0].key);
          }
        });
      }

      if (price && size) {
        product.variant.push({ price, size });
      }

      if (variant.images && variant.images.length) {
        variant.images.forEach((image) => {
          product.images.push(image.url);
        });
      }
    });
    return product;
  }

  private getCategoriesFromData(data: ClientResponse<CategoryPagedQueryResponse> | Error): Category[] | null {
    let category: Category[] | null = null;
    if (isClientResponse(data)) {
      if (isCategoryPagedQueryResponse(data.body)) {
        category = this.adaptCategoryPagedQueryToClient(data.body);
        getStore().dispatch(setCategories(category));
      }
    }
    return category;
  }

  private getProductFromData(data: ClientResponse<ProductResponse> | Error): Product | null {
    let product: Product | null = null;
    if (isClientResponse(data) && isProductResponse(data.body)) {
      product = this.adaptProductToClient(data.body);
    }
    return product;
  }

  private getProductsFromData(data: ClientResponse<ProductPagedQueryResponse> | Error): Product[] | null {
    let productList: Product[] | null = null;
    if (isClientResponse(data) && isProductPagedQueryResponse(data.body)) {
      productList = this.adaptProductPagedQueryToClient(data.body);
    }
    return productList;
  }

  public async getAllProducts(): Promise<Product[] | null> {
    const data = await this.root.getAllProducts();
    const products = this.getProductsFromData(data);
    if (products) {
      getStore().dispatch(setProducts(products));
    }
    return products;
  }

  public async getCategories(): Promise<Category[] | null> {
    const data = await this.root.getCategories();
    return this.getCategoriesFromData(data);
  }

  public async getProductById(id: string): Promise<Product | null> {
    const data = await this.root.getProductByID(id);
    return this.getProductFromData(data);
  }
}

const createProductModel = (): ProductModel => new ProductModel();

const productModel = createProductModel();

export default function getProductModel(): ProductModel {
  return productModel;
}
