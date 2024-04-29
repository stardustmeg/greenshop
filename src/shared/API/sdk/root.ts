import { type ByProjectKeyRequestBuilder, createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

import client from './client.ts';

type Nullable<T> = T | null;

export type Credentials = {
  clientID: Nullable<string>;
  clientSecret: Nullable<string>;
  projectKey: Nullable<string>;
  scopes: Nullable<string>;
};

export default function root({ clientID, clientSecret, projectKey, scopes }: Credentials): ByProjectKeyRequestBuilder {
  return createApiBuilderFromCtpClient(
    client(projectKey || '', clientID || '', clientSecret || '', scopes || ''),
  ).withProjectKey({ projectKey: projectKey || '' });
}
