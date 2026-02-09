import type { Coupon } from '@/shared/types/cart.ts';
import type { Category } from '@/shared/types/product.ts';
import type {
  ClientResponse,
  DiscountCode,
  DiscountCodePagedQueryResponse,
  ProductDiscountPagedQueryResponse,
} from '@commercetools/platform-sdk';

import { showErrorMessage } from '@/shared/utils/userMessage.ts';

import getProductModel from '../../product/model/ProductModel.ts';
import {
  isClientResponse,
  isDiscountCodePagedQueryResponse,
  isProductDiscountPagedQueryResponse,
} from '../../types/validation.ts';
import DiscountApi from '../DiscountApi.ts';

export class DiscountModel {
  private coupons: Coupon[] = [];

  private root: DiscountApi;

  constructor() {
    this.root = new DiscountApi();
    this.init().catch(showErrorMessage);
  }

  private adaptCoupon(data: DiscountCode): Coupon {
    return {
      cartDiscount: data.id,
      discountCode: data.code,
      id: data.cartDiscounts[0].id,
    };
  }

  private getCategorySaleFromData(
    data: ClientResponse<ProductDiscountPagedQueryResponse>,
    categories: Category[],
  ): Category[] {
    const result: Category[] = [];
    if (isClientResponse(data) && isProductDiscountPagedQueryResponse(data.body)) {
      const allReferences = data.body.results.flatMap((result) => result.references);
      allReferences.forEach((rule) => {
        if (rule.typeId === 'category') {
          const categorySale = categories.find((category) => category.id === rule.id);
          if (categorySale) {
            result.push(categorySale);
          }
        }
      });
    }
    return result;
  }

  private getCouponsFromData(data: ClientResponse<DiscountCodePagedQueryResponse>): Coupon[] {
    const coupons: Coupon[] = [];
    if (isClientResponse(data) && isDiscountCodePagedQueryResponse(data.body)) {
      coupons.push(...data.body.results.map((el) => this.adaptCoupon(el)));
    }
    return coupons;
  }

  private async init(): Promise<Coupon[]> {
    if (!this.coupons.length) {
      const data = await this.root.getCoupons();
      this.coupons = this.getCouponsFromData(data);
    }
    return this.coupons;
  }

  public getAllCoupons(): Coupon[] {
    return this.coupons;
  }

  public async getCategorySales(): Promise<Category[]> {
    const data = await this.root.getDiscounts();
    const categories = await getProductModel().getCategories();
    return this.getCategorySaleFromData(data, categories);
  }
}

const createDiscountModel = (): DiscountModel => new DiscountModel();

const discountModel = createDiscountModel();

export default function getDiscountModel(): DiscountModel {
  return discountModel;
}
