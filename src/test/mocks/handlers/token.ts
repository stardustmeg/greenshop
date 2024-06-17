import { HttpResponse, http } from 'msw';

const token = {
  access_token: '3pQ1oMrAIqDGIfiJ1Vj5txcKq7H7EtbC',
  expires_in: 10800,
  refresh_token: 'green-shop:IY1ZJDEe82gz7SsV2awdlo1CXYxA3UGpwJlZQmrc_XY',
  scope: import.meta.env.VITE_APP_CTP_SCOPES.split(' '),
  token_type: 'Bearer',
};

const handlers = [
  http.post(
    `${import.meta.env.VITE_APP_CTP_AUTH_URL}/oauth/${import.meta.env.VITE_APP_CTP_PROJECT_KEY}/anonymous/token`,
    () => HttpResponse.json(token),
  ),
  http.post(
    `${import.meta.env.VITE_APP_CTP_AUTH_URL}/oauth/${import.meta.env.VITE_APP_CTP_PROJECT_KEY}/customers/token`,
    () => HttpResponse.json(token),
  ),
];

export default handlers;
