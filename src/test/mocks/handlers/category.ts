import { HttpResponse, http } from 'msw';

import { TEST_API_URL, TEST_PROJECT_KEY } from '../constant.ts';

const categoryList = {
  count: 1,
  limit: 20,
  offset: 0,
  results: [
    {
      ancestors: [
        {
          id: 'cbc4591a-cdd8-4f93-840b-5cb40e47ada8',
          typeId: 'category',
        },
      ],
      assets: [],
      createdAt: '2024-04-27T13:33:02.558Z',
      createdBy: {
        isPlatformClient: true,
      },
      description: {
        en: 'Seeds',
        ru: 'Семена',
      },
      externalId: 'seeds',
      id: '8e12968e-dc4e-4e19-a8cd-994fe1acf3e6',
      key: 'seeds',
      lastMessageSequenceNumber: 3,
      lastModifiedAt: '2024-06-08T08:07:45.907Z',
      lastModifiedBy: {
        isPlatformClient: true,
      },
      metaDescription: {
        en: 'Seeds',
        ru: 'Семена',
      },
      metaTitle: {
        en: 'seeds',
      },
      name: {
        en: 'Seeds',
        ru: 'Семена',
      },
      orderHint: '0.31',
      parent: {
        id: 'cbc4591a-cdd8-4f93-840b-5cb40e47ada8',
        typeId: 'category',
      },
      slug: {
        en: 'seeds',
        ru: 'seeds',
      },
      version: 15,
      versionModifiedAt: '2024-06-08T08:07:45.907Z',
    },
  ],
  total: 1,
};
const handlers = [http.get(`${TEST_API_URL}/${TEST_PROJECT_KEY}/categories`, () => HttpResponse.json(categoryList))];

export default handlers;
