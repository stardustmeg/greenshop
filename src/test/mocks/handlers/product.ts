import { HttpResponse, http } from 'msw';

const productList = {
  count: 1,
  limit: 9,
  offset: 0,
  results: [
    {
      categories: [
        {
          id: '4de8975a-b68f-49e6-a8ea-c1e97c51c2a8',
          typeId: 'category',
        },
      ],
      categoryOrderHints: {},
      createdAt: '2024-05-18T05:58:06.974Z',
      description: {
        en: 'Zamioculcas (Latin: Zamioculcas) is a houseplant of the Aroid family, distributed in Africa. This genus is represented by a single species - Zamioculcas zamielistny, in nature it can be found in tropical forests. The name of the plant was given because of the similarity to the leaves of zamia. Zamiokulkas is a herbaceous plant with a tuberous rhizome. The thin stem has evenly spaced dark green glossy leaves, which are oval in shape with a pointed tip.',
        ru: 'Замиокулькас (лат. Zamioculcas) - это домашнее растение семейства Ароидные, распространенное на территории Африки. Данный род представлен единственным видом - Замиокулькас замиелистный, в природе его можно встретить в тропических лесах. Название растению дали из-за сходства с листьями замии. Замиокулькас представляет собой травянистое растение с клубнеобразным корневищем. На тонком стебле равномерно располагаются тёмно-зеленые глянцевые листья, они имеют овальную форму с заострением на конце.',
      },
      hasStagedChanges: false,
      id: '8247d798-ca84-4b90-ae1c-d7e5490f58b7',
      key: '79357868957074',
      lastModifiedAt: '2024-05-26T13:44:24.877Z',
      masterVariant: {
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
        isMatchingVariant: true,
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
      metaDescription: {
        en: 'house plants',
      },
      metaTitle: {
        en: 'house plants',
      },
      name: {
        en: 'Zamioculcas',
        ru: 'Замиокулькас',
      },
      priceMode: 'Embedded',
      productType: {
        id: '986435e1-45b9-4f14-bcee-9ae3921e5d3c',
        typeId: 'product-type',
      },
      published: true,
      searchKeywords: {
        en: [
          {
            text: 'zamioculcas',
          },
        ],
        ru: [
          {
            text: 'замиокулькас',
          },
        ],
      },
      slug: {
        en: 'zamioculcas',
        ru: 'zamioculcas',
      },
      taxCategory: {
        id: '47d25f8a-b0df-4a76-8929-7115bf2bcbc1',
        typeId: 'tax-category',
      },
      variants: [
        {
          assets: [],
          attributes: [
            {
              name: 'new_arrival',
              value: [false],
            },
            {
              name: 'size',
              value: [
                {
                  key: 'M',
                  label: 'M',
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
          id: 2,
          images: [],
          isMatchingVariant: true,
          key: '79357868957074_2',
          prices: [
            {
              id: 'baf88e8a-23f6-4a52-ae18-45e5bfb93b12',
              key: '79357868957074_2',
              value: {
                centAmount: 2500,
                currencyCode: 'USD',
                fractionDigits: 2,
                type: 'centPrecision',
              },
            },
          ],
          sku: '79357868957074_2',
        },
        {
          assets: [],
          attributes: [
            {
              name: 'new_arrival',
              value: [false],
            },
            {
              name: 'size',
              value: [
                {
                  key: 'XL',
                  label: 'XL',
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
          id: 3,
          images: [],
          isMatchingVariant: true,
          key: '79357868957074_4',
          prices: [
            {
              id: '5592000f-86c5-4e42-916b-9b62580e7904',
              key: '79357868957074_4',
              value: {
                centAmount: 5600,
                currencyCode: 'USD',
                fractionDigits: 2,
                type: 'centPrecision',
              },
            },
          ],
          sku: '79357868957074_4',
        },
      ],
      version: 25,
    },
  ],
  total: 1,
};

const handlers = [
  http.get(
    `${import.meta.env.VITE_APP_CTP_API_URL}/${import.meta.env.VITE_APP_CTP_PROJECT_KEY}/product-projections/search`,
    () => HttpResponse.json(productList),
  ),
];

export default handlers;
