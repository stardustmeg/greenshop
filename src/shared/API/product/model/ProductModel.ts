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

import { PRICE_FRACTIONS } from '@/shared/constants/product.ts';
import getSize from '@/shared/utils/size.ts';

import {
  Attribute,
  type CategoriesProductCount,
  type OptionsRequest,
  type PriceRange,
  type ProductWithCount,
  type SizeProductCount,
} from '../../types/type.ts';
import {
  isAttributePlainEnumValue,
  isCategoryPagedQueryResponse,
  isClientResponse,
  isFacetRange,
  isFacetTerm,
  isLocalizationObj,
  isProductProjection,
  isProductProjectionPagedQueryResponse,
  isProductProjectionPagedSearchResponse,
  isRangeFacetResult,
  isTermFacetResult,
} from '../../types/validation.ts';
import getProductApi, { type ProductApi } from '../ProductApi.ts';

export class ProductModel {
  private categories: Category[] = [];

  private root: ProductApi;

  constructor() {
    this.root = getProductApi();
  }

  private adaptCategoryPagedQueryToClient(data: CategoryPagedQueryResponse): Category[] {
    const response = data.results.map((category) => {
      const result: Category = {
        id: category.id ?? '',
        key: category.key ?? '',
        name: [],
        parent: null,
        slug: [],
      };

      if (category.parent) {
        const parentCategory = data.results.find((item) => item.id === category.parent?.id);
        if (parentCategory) {
          result.parent = {
            id: parentCategory.id || '',
            key: parentCategory.key || '',
            name: [],
            parent: null,
            slug: [],
          };
          result.parent.slug.push(...this.adaptLocalizationValue(parentCategory.slug));
          result.parent.name.push(...this.adaptLocalizationValue(parentCategory.name));
        }
      }

      result.slug.push(...this.adaptLocalizationValue(category.slug));
      result.name.push(...this.adaptLocalizationValue(category.name));

      return result;
    });
    return response;
  }

  private adaptCategoryReference(data: CategoryReference[]): Category[] {
    const response: Category[] = [];
    data.forEach((category) => {
      const categoryEl = this.categories.find((el) => el.id === category.id);
      if (categoryEl) {
        response.push(categoryEl);
      }
    });
    return response;
  }

  private adaptDiscount(variant: ProductVariant): number {
    let minPrice = 0;

    if (variant.prices?.length && variant.prices[0].discounted) {
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

  private adaptPrice(variant: ProductVariant): number {
    let price = 0;

    if (variant.prices?.length) {
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
      key: product.key ?? '',
      name: [],
      slug: [],
      variant: [],
    };
    result.category.push(...this.adaptCategoryReference(product.categories));
    result.description.push(...this.adaptLocalizationValue(product.description));
    result.name.push(...this.adaptLocalizationValue(product.name));
    result.slug.push(...this.adaptLocalizationValue(product.slug));

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

      if (variant.attributes?.length) {
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
        id: variant.id,
        price: this.adaptPrice(variant) || 0,
        size,
      });

      if (variant.images?.length) {
        variant.images.forEach((image) => {
          product.images.push(image.url);
        });
      }
    });
    return product;
  }

  private getCategoriesFromData(data: ClientResponse<CategoryPagedQueryResponse>): Category[] {
    if (isClientResponse(data)) {
      if (isCategoryPagedQueryResponse(data.body)) {
        this.categories = this.adaptCategoryPagedQueryToClient(data.body);
      }
    }
    return this.categories;
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
        categoriesFacet.terms.forEach((term) => {
          if (isFacetTerm(term)) {
            const currentCategory = this.categories.find((el) => el.id === term.term);
            if (currentCategory) {
              category.push({
                category: currentCategory,
                count: term.productCount ?? 0,
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

  private getProductFromData(data: ClientResponse<ProductProjection>): Product | null {
    let product: Product | null = null;
    if (isClientResponse(data) && isProductProjection(data.body)) {
      product = this.adaptProductProjectionToClient(data.body);
    }
    return product;
  }

  private getProductsFromData(data: ClientResponse<ProductProjectionPagedSearchResponse>): Product[] {
    let productList: Product[] = [];
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

  public adaptLocalizationValue(data: LocalizedString | undefined): localization[] {
    const result: localization[] = [];
    Object.entries(data || {}).forEach(([language, value]) => {
      result.push({
        language,
        value,
      });
    });
    return result;
  }

  public async getCategories(): Promise<Category[] | null> {
    if (!this.categories.length) {
      const data = await this.root.getCategories();
      return this.getCategoriesFromData(data);
    }
    return this.categories;
  }

  public async getPriceRange(): Promise<PriceRange> {
    const data = await this.root.getPriceRange();
    return this.getPriceRangeFromData(data);
  }

  public async getProductByKey(key: string): Promise<Product | null> {
    const data = await this.root.getProductByKey(key);
    const product = this.getProductFromData(data);
    return product;
  }

  public async getProducts(options?: OptionsRequest): Promise<ProductWithCount> {
    const data = await this.root.getProducts(options);
    const products = this.getProductsFromData(data);
    const sizeCount = this.getSizeProductCountFromData(data);
    const categoryCount = this.getCategoriesProductCountFromData(data);
    const priceRange = this.getPriceRangeFromData(data);
    const result: ProductWithCount = {
      categoryCount,
      priceRange,
      products,
      sizeCount,
    };
    return result;
  }
}

const createProductModel = (): ProductModel => new ProductModel();

const productModel = createProductModel();

export default function getProductModel(): ProductModel {
  return productModel;
}
