import {
  type AuthMiddlewareOptions,
  type Client,
  ClientBuilder,
  type HttpMiddlewareOptions,
} from '@commercetools/sdk-client-v2';

const URL_AUTH = 'https://auth.europe-west1.gcp.commercetools.com';
const URL_HTTP = 'https://api.europe-west1.gcp.commercetools.com';

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  fetch,
  host: URL_HTTP,
};

export default function client(projectKey: string, clientID: string, clientSecret: string, scopes: string): Client {
  const scopesArr = scopes.split(',');
  const authMiddlewareOptions: AuthMiddlewareOptions = {
    credentials: {
      clientId: clientID,
      clientSecret,
    },
    fetch,
    host: URL_AUTH,
    projectKey,
    scopes: scopesArr,
  };

  return new ClientBuilder()
    .withProjectKey(projectKey)
    .withHttpMiddleware(httpMiddlewareOptions)
    .withClientCredentialsFlow(authMiddlewareOptions)
    .build();
}
