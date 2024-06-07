import type { ClientResponse, DiscountCodePagedQueryResponse } from '@commercetools/platform-sdk';

import getApiClient, { type ApiClient } from '../sdk/client.ts';

export class DiscountApi {
  private client: ApiClient;

  constructor() {
    this.client = getApiClient();
  }

  public async getCoupons(): Promise<ClientResponse<DiscountCodePagedQueryResponse>> {
    const data = await this.client.apiRoot().discountCodes().get().execute();
    return data;
  }
}

const createDiscountApi = (): DiscountApi => new DiscountApi();

const discountApi = createDiscountApi();

export default function getDiscountApi(): DiscountApi {
  return discountApi;
}
