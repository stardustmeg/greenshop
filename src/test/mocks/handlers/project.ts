import { HttpResponse, http } from 'msw';

const project = {
  carts: {
    allowAddingUnpublishedProducts: false,
    cartDiscountCache: {
      enabled: false,
    },
    countryTaxRateFallbackEnabled: false,
    deleteDaysAfterLastModification: 90,
    loadParsedDiscountsEnabled: false,
  },
  countries: ['DE', 'AT', 'BE', 'AZ', 'BG', 'BY', 'CH', 'CZ', 'EE', 'ES', 'EU', 'EZ', 'RU', 'US', 'AE', 'AU'],
  createdAt: '2024-04-26T19:16:17.394Z',
  createdBy: {
    isPlatformClient: true,
    user: {
      id: '9cd5771e-eb9b-4e70-8f16-a91c52216948',
      typeId: 'user',
    },
  },
  currencies: ['USD', 'RUB'],
  key: 'green-shop',
  languages: ['en', 'ru'],
  lastModifiedAt: '2024-05-16T07:13:50.923Z',
  lastModifiedBy: {
    isPlatformClient: true,
  },
  messages: {
    deleteDaysAfterCreation: 15,
    enabled: false,
  },
  name: 'Green Shop',
  searchIndexing: {
    customers: {
      lastModifiedAt: '2024-05-16T07:13:50.915Z',
      lastModifiedBy: {
        isPlatformClient: true,
      },
      status: 'Activated',
    },
    products: {
      lastModifiedAt: '2024-05-05T18:13:15.638Z',
      lastModifiedBy: {
        isPlatformClient: true,
      },
      status: 'Activated',
    },
  },
  shoppingLists: {
    deleteDaysAfterLastModification: 360,
  },
  trialUntil: '2024-06',
  version: 14,
};

const handlers = [
  http.get(`${import.meta.env.VITE_APP_CTP_API_URL}/${import.meta.env.VITE_APP_CTP_PROJECT_KEY}`, () =>
    HttpResponse.json(project),
  ),
];

export default handlers;
