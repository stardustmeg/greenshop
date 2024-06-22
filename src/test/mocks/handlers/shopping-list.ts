import { HttpResponse, http } from 'msw';

import { TEST_API_URL, TEST_PROJECT_KEY } from '../constant.ts';

const shopList = {
  anonymousId: '599456f9-bff8-46e7-8c9b-5f6e60dabb27',
  createdAt: '2024-06-12T12:52:38.321Z',
  createdBy: {
    anonymousId: '599456f9-bff8-46e7-8c9b-5f6e60dabb27',
    clientId: 'BPJMQ0wyC-4dA_1sd04SlJQx',
    isPlatformClient: false,
  },
  customer: {
    id: 'a9a1b24b-a467-4850-9a1c-c4030dff9949',
    typeId: 'customer',
  },
  deleteDaysAfterLastModification: 2,
  id: 'e70b4b40-2cd8-4109-87ce-8f35086c2852',
  lastModifiedAt: '2024-06-16T08:44:19.700Z',
  lastModifiedBy: {
    clientId: 'BPJMQ0wyC-4dA_1sd04SlJQx',
    customer: {
      id: 'a9a1b24b-a467-4850-9a1c-c4030dff9949',
      typeId: 'customer',
    },
    isPlatformClient: false,
  },
  lineItems: [],
  name: {
    en: 'Favorite',
    ru: 'Favorite',
  },
  textLineItems: [],
  version: 3,
  versionModifiedAt: '2024-06-16T08:44:19.700Z',
};

const shopListList = {
  count: 1,
  limit: 9,
  offset: 0,
  results: [shopList],
  total: 1,
};
const handlers = [
  http.get(`${TEST_API_URL}/${TEST_PROJECT_KEY}/me/shopping-lists`, () => HttpResponse.json(shopListList)),
  http.get(`${TEST_API_URL}/${TEST_PROJECT_KEY}/shopping-lists/*`, () => HttpResponse.json(shopListList)),
  http.post(`${TEST_API_URL}/${TEST_PROJECT_KEY}/me/shopping-lists`, () => HttpResponse.json(shopList)),
  http.post(`${TEST_API_URL}/${TEST_PROJECT_KEY}/shopping-lists`, () => HttpResponse.json(shopList)),
  http.post(`${TEST_API_URL}/${TEST_PROJECT_KEY}/shopping-lists/*`, () => HttpResponse.json(shopList)),
  http.post(`${TEST_API_URL}/${TEST_PROJECT_KEY}/me/shopping-lists/*`, () => HttpResponse.json(shopList)),
  http.delete(`${TEST_API_URL}/${TEST_PROJECT_KEY}/me/shopping-lists/*`, () => HttpResponse.json(shopList)),
];

export default handlers;
