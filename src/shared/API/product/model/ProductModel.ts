import type { Category, Product, SizeType, localization } from '@/shared/types/product.ts';
import type {
  Attribute as AttributeResponse,
  CategoryPagedQueryResponse,
  CategoryReference,
  ClientResponse,
  LocalizedString,
  ProductProjection,
  ProductProjectionPagedQueryResponse,
  ProductProjectionPagedSearchResponse,
  ProductVariant,
} from '@commercetools/platform-sdk';

import getStore from '@/shared/Store/Store.ts';
import { setCategories } from '@/shared/Store/actions.ts';
import { PRICE_FRACTIONS } from '@/shared/constants/product.ts';
import getSize from '@/shared/utils/size.ts';

import getRoot, { type RootApi } from '../../sdk/root.ts';
import {
  Attribute,
  type CategoriesProductCount,
  type OptionsRequest,
  type PriceRange,
  type SizeProductCount,
} from '../../types/type.ts';
import {
  isAttributePlainEnumValue,
  isCategoryPagedQueryResponse,
  isClientResponse,
  isFacetRange,
  isFacetTerm,
  isLocalizationObj,
  isProductProjectionPagedQueryResponse,
  isProductProjectionPagedSearchResponse,
  isRangeFacetResult,
  isTermFacetResult,
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

  private adaptDiscount(variant: ProductVariant): number {
    let minPrice = 0;

    if (variant.prices && variant.prices.length && variant.prices[0].discounted) {
      const priceRow = variant.prices[0];
      if (priceRow.discounted) {
        minPrice = priceRow.discounted.value.centAmount / PRICE_FRACTIONS;
      }
    }
    return minPrice;
  }

  private adaptFullDescription(attribute: AttributeResponse): localization[] {
    if (isLocalizationObj(attribute.value)) {
      return this.adaptLocalizationValue(attribute.value);
    }
    return [];
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

  private adaptPrice(variant: ProductVariant): number {
    let price = 0;

    if (variant.prices && variant.prices.length) {
      const priceRow = variant.prices[0];
      price = priceRow.value.centAmount / PRICE_FRACTIONS;
    }
    return price;
  }

  private adaptProductProjectionPagedQueryToClient(data: ProductProjectionPagedQueryResponse): Product[] {
    const response = data.results.map((product) => this.adaptProductProjectionToClient(product));
    return response;
  }

  private adaptProductProjectionToClient(product: ProductProjection): Product {
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
    result.category.push(...this.adaptCategoryReference(product.categories));
    result.description.push(...this.adaptLocalizationValue(product.description));
    result.name.push(...this.adaptLocalizationValue(product.name));

    Object.assign(result, this.adaptVariants(result, product));

    result.fullDescription = [...new Set(result.fullDescription)];
    result.variant = [...new Set(result.variant)];
    result.images = [...new Set(result.images)];

    return result;
  }

  private adaptSize(attribute: AttributeResponse): SizeType | null {
    if (Array.isArray(attribute.value) && attribute.value.length && isAttributePlainEnumValue(attribute.value[0])) {
      return getSize(attribute.value[0].key);
    }
    return null;
  }

  private adaptVariants(product: Product, response: ProductProjection): Product {
    const variants = [...response.variants, response.masterVariant];
    variants.forEach((variant) => {
      let size: SizeType | null = null;

      if (variant.attributes && variant.attributes.length) {
        variant.attributes.forEach((attribute) => {
          if (attribute.name === Attribute.FULL_DESCRIPTION && !product.fullDescription.length) {
            product.fullDescription.push(...this.adaptFullDescription(attribute));
          }
          if (attribute.name === Attribute.SIZE) {
            size = this.adaptSize(attribute);
          }
        });
      }

      product.variant.push({
        discount: this.adaptDiscount(variant) || 0,
        price: this.adaptPrice(variant) || 0,
        size,
      });

      if (variant.images && variant.images.length) {
        variant.images.forEach((image) => {
          product.images.push(image.url);
        });
      }
    });
    return product;
  }

  private getCategoriesFromData(data: ClientResponse<CategoryPagedQueryResponse>): Category[] | null {
    let category: Category[] | null = null;
    if (isClientResponse(data)) {
      if (isCategoryPagedQueryResponse(data.body)) {
        category = this.adaptCategoryPagedQueryToClient(data.body);
        getStore().dispatch(setCategories(category));
      }
    }
    return category;
  }

  private getCategoriesProductCountFromData(
    data: ClientResponse<ProductProjectionPagedSearchResponse>,
  ): CategoriesProductCount[] {
    const category: CategoriesProductCount[] = [];
    if (
      isClientResponse(data) &&
      isProductProjectionPagedSearchResponse(data.body) &&
      'categories.id' in data.body.facets
    ) {
      const categoriesFacet = data.body.facets['categories.id'];
      if (isTermFacetResult(categoriesFacet)) {
        const categoryList = getStore().getState().categories;
        categoriesFacet.terms.forEach((term) => {
          if (isFacetTerm(term)) {
            const currentCategory = categoryList.find((el) => el.id === term.term);
            if (currentCategory) {
              category.push({
                category: currentCategory,
                count: term.productCount || 0,
              });
            }
          }
        });
      }
    }
    return category;
  }

  private getPriceRangeFromData(date: ClientResponse<ProductProjectionPagedSearchResponse>): PriceRange {
    const priceRange: PriceRange = {
      max: 0,
      min: 0,
    };
    if (
      isClientResponse(date) &&
      isProductProjectionPagedSearchResponse(date.body) &&
      'variants.price.centAmount' in date.body.facets
    ) {
      const variantsPrice = date.body.facets['variants.price.centAmount'];
      if (isRangeFacetResult(variantsPrice)) {
        variantsPrice.ranges.forEach((range) => {
          if (isFacetRange(range)) {
            priceRange.min = range.min / PRICE_FRACTIONS;
            priceRange.max = range.max / PRICE_FRACTIONS;
          }
        });
      }
    }
    return priceRange;
  }

  private getProductsFromData(data: ClientResponse<ProductProjectionPagedQueryResponse>): Product[] | null {
    let productList: Product[] | null = null;
    if (isClientResponse(data) && isProductProjectionPagedQueryResponse(data.body)) {
      productList = this.adaptProductProjectionPagedQueryToClient(data.body);
    }
    return productList;
  }

  private getSizeProductCountFromData(data: ClientResponse<ProductProjectionPagedSearchResponse>): SizeProductCount[] {
    const category: SizeProductCount[] = [];
    if (
      isClientResponse(data) &&
      isProductProjectionPagedSearchResponse(data.body) &&
      'variants.attributes.size.key' in data.body.facets
    ) {
      const categoriesFacet = data.body.facets['variants.attributes.size.key'];
      if (isTermFacetResult(categoriesFacet)) {
        categoriesFacet.terms.forEach((term) => {
          if (isFacetTerm(term) && typeof term.term === 'string') {
            const currentSize = getSize(term.term);
            if (currentSize) {
              category.push({
                count: term.count || 0,
                size: currentSize,
              });
            }
          }
        });
      }
    }
    return category;
  }

  public async getCategories(): Promise<Category[] | null> {
    const data = await this.root.getCategories();
    return this.getCategoriesFromData(data);
  }

  public async getCategoriesProductCount(): Promise<CategoriesProductCount[]> {
    const data = await this.root.getCategoriesProductCount();
    return this.getCategoriesProductCountFromData(data);
  }

  public async getPriceRange(): Promise<PriceRange> {
    const data = await this.root.getPriceRange();
    return this.getPriceRangeFromData(data);
  }

  public async getProducts(options?: OptionsRequest): Promise<Product[] | null> {
    const data = await this.root.getProducts(options);
    const products = this.getProductsFromData(data);
    if (products) {
      // getStore().dispatch(setProducts(products));
    }
    return products;
  }

  public async getSizeProductCount(): Promise<SizeProductCount[]> {
    const data = await this.root.getSizeProductCount();
    return this.getSizeProductCountFromData(data);
  }
}

const createProductModel = (): ProductModel => new ProductModel();

const productModel = createProductModel();

export default function getProductModel(): ProductModel {
  return productModel;
}
