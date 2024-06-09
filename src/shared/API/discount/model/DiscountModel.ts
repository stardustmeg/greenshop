import type { Coupon } from '@/shared/types/cart.ts';
import type { ClientResponse, DiscountCode, DiscountCodePagedQueryResponse } from '@commercetools/platform-sdk';

import { showErrorMessage } from '@/shared/utils/userMessage.ts';

import { isClientResponse, isDiscountCodePagedQueryResponse } from '../../types/validation.ts';
import getDiscountApi, { type DiscountApi } from '../DiscountApi.ts';

export class DiscountModel {
  private coupons: Coupon[] = [];

  private root: DiscountApi;

  constructor() {
    this.root = getDiscountApi();
    this.init().catch(showErrorMessage);
  }

  private adaptCoupon(data: DiscountCode): Coupon {
    return {
      cartDiscount: data.id,
      discountCode: data.code,
      id: data.cartDiscounts[0].id,
    };
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
}

const createDiscountModel = (): DiscountModel => new DiscountModel();

const discountModel = createDiscountModel();

export default function getDiscountModel(): DiscountModel {
  return discountModel;
}
