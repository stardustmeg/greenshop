import { HttpResponse, http } from 'msw';

const carts = {
  anonymousId: 'f6b6183e-cc73-4b19-a65e-f408fc785e89',
  cartState: 'Merged',
  createdAt: '2024-06-14T15:51:18.227Z',
  createdBy: {
    anonymousId: 'c3eeabe1-a0fb-49a6-ab10-f3bf19d933c8',
    clientId: 'BPJMQ0wyC-4dA_1sd04SlJQx',
    isPlatformClient: false,
  },
  customLineItems: [],
  customerId: 'a9a1b24b-a467-4850-9a1c-c4030dff9949',
  deleteDaysAfterLastModification: 2,
  directDiscounts: [],
  discountCodes: [],
  id: '311ee12e-a1a3-4ec2-b69e-0e6f03fcba36',
  inventoryMode: 'None',
  itemShippingAddresses: [],
  lastMessageSequenceNumber: 1,
  lastModifiedAt: '2024-06-16T08:44:18.913Z',
  lastModifiedBy: {
    anonymousId: 'f6b6183e-cc73-4b19-a65e-f408fc785e89',
    clientId: 'BPJMQ0wyC-4dA_1sd04SlJQx',
    isPlatformClient: false,
  },
  lineItems: [
    {
      addedAt: '2024-06-14T15:51:41.583Z',
      discountedPricePerQuantity: [],
      id: '0d56624b-946b-4ac0-b6a7-178f06a3472a',
      lastModifiedAt: '2024-06-14T15:51:41.583Z',
      lineItemMode: 'Standard',
      name: {
        en: 'Zamioculcas',
        ru: 'Замиокулькас',
      },
      perMethodTaxRate: [],
      price: {
        id: '48eacec5-a0bc-4302-92da-654f37b9d0d3',
        key: '79357868957074_1',
        value: {
          centAmount: 1500,
          currencyCode: 'USD',
          fractionDigits: 2,
          type: 'centPrecision',
        },
      },
      priceMode: 'Platform',
      productId: '8247d798-ca84-4b90-ae1c-d7e5490f58b7',
      productKey: '79357868957074',
      productType: {
        id: '986435e1-45b9-4f14-bcee-9ae3921e5d3c',
        typeId: 'product-type',
        version: 30,
      },
      quantity: 1,
      state: [
        {
          quantity: 1,
          state: {
            id: '8baf5a56-683c-4e5f-a411-0ce8e62cc86e',
            typeId: 'state',
          },
        },
      ],
      taxedPricePortions: [],
      totalPrice: {
        centAmount: 1500,
        currencyCode: 'USD',
        fractionDigits: 2,
        type: 'centPrecision',
      },
      variant: {
        assets: [
          {
            id: 'e629929b-9c3f-4141-8e6e-77608a84d138',
            key: 'img-1',
            name: {
              en: 'img-1',
            },
            sources: [
              {
                uri: 'https://raw.githubusercontent.com/stardustmeg/greenshop-db/main/79357868957074/img-1.png',
              },
            ],
            tags: [],
          },
          {
            id: '18260724-dc23-46c7-8af1-2749b474a7ef',
            key: 'img-2',
            name: {
              en: 'img-2',
            },
            sources: [
              {
                uri: 'https://raw.githubusercontent.com/stardustmeg/greenshop-db/main/79357868957074/img-2.png',
              },
            ],
            tags: [],
          },
          {
            id: '0487e650-c792-45d8-aff7-e1dff5e23254',
            key: 'img-3',
            name: {
              en: 'img-3',
            },
            sources: [
              {
                uri: 'https://raw.githubusercontent.com/stardustmeg/greenshop-db/main/79357868957074/img-3.png',
              },
            ],
            tags: [],
          },
          {
            id: 'da50912b-eaed-4738-a432-65dfadd964b3',
            key: 'img-4',
            name: {
              en: 'img-4',
            },
            sources: [
              {
                uri: 'https://raw.githubusercontent.com/stardustmeg/greenshop-db/main/79357868957074/img-4.png',
              },
            ],
            tags: [],
          },
        ],
        attributes: [
          {
            name: 'new_arrival',
            value: [false],
          },
          {
            name: 'size',
            value: [
              {
                key: 'S',
                label: 'S',
              },
            ],
          },
          {
            name: 'full_description',
            value: {
              en: 'Zamiokulkas needs plenty of sunlight, suitable temperature conditions are in the range of 18 to 25 degrees Celsius, in winter 16-18. Water abundantly, but not often, about once a week. Daily spraying will be useful. In spring and summer, feed once a month, using fertilizers for cacti and succulents.',
              ru: 'Замиокулькас нуждается в большом количестве солнечного света, подходящие температурные условия находятся в диапазоне от 18 до 25 градусов тепла, зимой 16-18. Поливают обильно, но не часто, примерно раз в неделю. Будут полезны ежедневные опрыскивания. Весной и летом подкармливают раз в месяц, используя удобрения для кактусов и суккулентов.',
            },
          },
          {
            name: 'level',
            value: [
              {
                key: '1',
                label: '1',
              },
            ],
          },
        ],
        id: 1,
        images: [
          {
            dimensions: {
              h: 500,
              w: 500,
            },
            label: 'img-1',
            url: 'https://raw.githubusercontent.com/stardustmeg/greenshop-db/main/79357868957074/img-1.png',
          },
          {
            dimensions: {
              h: 500,
              w: 500,
            },
            label: 'img-2',
            url: 'https://raw.githubusercontent.com/stardustmeg/greenshop-db/main/79357868957074/img-2.png',
          },
          {
            dimensions: {
              h: 500,
              w: 500,
            },
            label: 'img-3',
            url: 'https://raw.githubusercontent.com/stardustmeg/greenshop-db/main/79357868957074/img-3.png',
          },
          {
            dimensions: {
              h: 500,
              w: 500,
            },
            label: 'img-4',
            url: 'https://raw.githubusercontent.com/stardustmeg/greenshop-db/main/79357868957074/img-4.png',
          },
        ],
        key: '79357868957074_1',
        prices: [
          {
            id: '48eacec5-a0bc-4302-92da-654f37b9d0d3',
            key: '79357868957074_1',
            value: {
              centAmount: 1500,
              currencyCode: 'USD',
              fractionDigits: 2,
              type: 'centPrecision',
            },
          },
        ],
        sku: '79357868957074_1',
      },
    },
  ],
  origin: 'Customer',
  refusedGifts: [],
  shipping: [],
  shippingMode: 'Single',
  taxCalculationMode: 'LineItemLevel',
  taxMode: 'Platform',
  taxRoundingMode: 'HalfEven',
  totalLineItemQuantity: 1,
  totalPrice: {
    centAmount: 1500,
    currencyCode: 'USD',
    fractionDigits: 2,
    type: 'centPrecision',
  },
  type: 'Cart',
  version: 120,
  versionModifiedAt: '2024-06-16T08:44:18.913Z',
};

const cartList = {
  count: 1,
  limit: 20,
  offset: 0,
  results: [carts],
  total: 1,
};

const handlers = [
  http.get(`${import.meta.env.VITE_APP_CTP_API_URL}/${import.meta.env.VITE_APP_CTP_PROJECT_KEY}/me/carts`, () =>
    HttpResponse.json(cartList),
  ),
  http.post(`${import.meta.env.VITE_APP_CTP_API_URL}/${import.meta.env.VITE_APP_CTP_PROJECT_KEY}/me/carts`, () =>
    HttpResponse.json(cartList),
  ),
  http.post(`${import.meta.env.VITE_APP_CTP_API_URL}/${import.meta.env.VITE_APP_CTP_PROJECT_KEY}/carts/*`, () =>
    HttpResponse.json(carts),
  ),
  http.get(`${import.meta.env.VITE_APP_CTP_API_URL}/${import.meta.env.VITE_APP_CTP_PROJECT_KEY}/carts/*`, () =>
    HttpResponse.json(carts),
  ),
  http.post(`${import.meta.env.VITE_APP_CTP_API_URL}/${import.meta.env.VITE_APP_CTP_PROJECT_KEY}/me/carts/*`, () =>
    HttpResponse.json(carts),
  ),
];

export default handlers;
