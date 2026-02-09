import { HttpResponse, http } from 'msw';

const discountList = {
  count: 4,
  limit: 20,
  offset: 0,
  results: [
    {
      cartDiscounts: [
        {
          id: 'ff195f35-c6f6-4959-a69b-2cd626e6ce60',
          typeId: 'cart-discount',
        },
      ],
      code: 'first-key-1',
      createdAt: '2024-04-29T07:55:04.369Z',
      createdBy: {
        isPlatformClient: true,
        user: {
          id: '9cd5771e-eb9b-4e70-8f16-a91c52216948',
          typeId: 'user',
        },
      },
      description: {
        en: 'first',
      },
      groups: [],
      id: 'fcff07da-a136-4cbd-bedb-a089c0818089',
      isActive: true,
      lastMessageSequenceNumber: 1,
      lastModifiedAt: '2024-04-29T07:55:13.613Z',
      lastModifiedBy: {
        isPlatformClient: true,
        user: {
          id: '9cd5771e-eb9b-4e70-8f16-a91c52216948',
          typeId: 'user',
        },
      },
      maxApplicationsPerCustomer: 1,
      name: {
        en: 'first',
      },
      references: [],
      version: 2,
      versionModifiedAt: '2024-04-29T07:55:13.613Z',
    },
  ],
  total: 4,
};

const handlers = [
  http.get(`${import.meta.env.VITE_APP_CTP_API_URL}/${import.meta.env.VITE_APP_CTP_PROJECT_KEY}/discount-codes`, () =>
    HttpResponse.json(discountList),
  ),
];

export default handlers;
