import { type ClientResponse, type ProductPagedQueryResponse } from '@commercetools/platform-sdk';

import root, { type Credentials } from './root.ts';

export default function request(credentials: Credentials): Promise<ClientResponse<ProductPagedQueryResponse> | Error> {
  return root(credentials)
    .products()
    .get()
    .execute()
    .catch((err: Error) => err);
}
