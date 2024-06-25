import { HttpResponse, http } from 'msw';

import { TEST_AUTH_URL, TEST_PROJECT_KEY, TEST_SCOPES } from '../constant.ts';

const token = {
  access_token: '3pQ1oMrAIqDGIfiJ1Vj5txcKq7H7EtbC',
  expires_in: 10800,
  refresh_token: 'green-shop:IY1ZJDEe82gz7SsV2awdlo1CXYxA3UGpwJlZQmrc_XY',
  scope: TEST_SCOPES.split(' '),
  token_type: 'Bearer',
};

const handlers = [
  http.post(`${TEST_AUTH_URL}/oauth/${TEST_PROJECT_KEY}/anonymous/token`, () => HttpResponse.json(token)),
  http.post(`${TEST_AUTH_URL}/oauth/${TEST_PROJECT_KEY}/customers/token`, () => HttpResponse.json(token)),
];

export default handlers;
