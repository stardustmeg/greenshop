import type {
  ClientResponse,
  DiscountCodePagedQueryResponse,
  ProductDiscountPagedQueryResponse,
} from '@commercetools/platform-sdk';

import getApiClient, { type ApiClient } from '../sdk/client.ts';

export default class DiscountApi {
  private client: ApiClient;

  constructor() {
    this.client = getApiClient();
  }

  public async getCoupons(): Promise<ClientResponse<DiscountCodePagedQueryResponse>> {
    const data = await this.client.apiRoot().discountCodes().get().execute();
    return data;
  }

  public async getDiscounts(): Promise<ClientResponse<ProductDiscountPagedQueryResponse>> {
    const data = await this.client.apiRoot().productDiscounts().get().execute();
    return data;
  }
}
