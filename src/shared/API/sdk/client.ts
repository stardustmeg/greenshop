import {
  type AuthMiddlewareOptions,
  type Client,
  ClientBuilder,
  type HttpMiddlewareOptions,
} from '@commercetools/sdk-client-v2';

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  fetch,
  host: 'https://api.europe-west1.gcp.commercetools.com',
};

export default function client(projectKey: string, clientID: string, clientSecret: string, scopes: string): Client {
  const scopesArr = scopes.split(',');
  const authMiddlewareOptions: AuthMiddlewareOptions = {
    credentials: {
      clientId: clientID,
      clientSecret,
    },
    fetch,
    host: 'https://auth.europe-west1.gcp.commercetools.com',
    projectKey,
    scopes: scopesArr,
  };

  return new ClientBuilder()
    .withProjectKey(projectKey)
    .withHttpMiddleware(httpMiddlewareOptions)
    .withClientCredentialsFlow(authMiddlewareOptions)
    .build();
}
