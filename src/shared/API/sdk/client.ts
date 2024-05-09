import type { UserCredentials } from '@/shared/types/user';

import { type ByProjectKeyRequestBuilder, createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import {
  type AuthMiddlewareOptions,
  type Client,
  ClientBuilder,
  type HttpMiddlewareOptions,
  type Middleware,
  type PasswordAuthMiddlewareOptions,
  type RefreshAuthMiddlewareOptions,
  createAuthForAnonymousSessionFlow,
  createAuthForClientCredentialsFlow,
  createAuthForPasswordFlow,
} from '@commercetools/sdk-client-v2';

import { TokenType } from '../types/type.ts';
import getTokenCache from './token-cache/token-cache.ts';

const URL_AUTH = 'https://auth.europe-west1.gcp.commercetools.com';
const URL_HTTP = 'https://api.europe-west1.gcp.commercetools.com';
const USE_SAVE_TOKEN = false;

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  fetch,
  host: URL_HTTP,
};

export default class ApiClient {
  private adminConnection: ByProjectKeyRequestBuilder;

  private anonymConnection: ByProjectKeyRequestBuilder | null = null;

  private authConnection: ByProjectKeyRequestBuilder | null = null;

  private clientID: string;

  private clientSecret: string;

  private isAuth = false;

  private projectKey: string;

  private scopes: string[];

  constructor(projectKey: string, clientID: string, clientSecret: string, scopes: string) {
    this.projectKey = projectKey;
    this.clientID = clientID;
    this.clientSecret = clientSecret;
    this.scopes = scopes.split(',');

    this.anonymConnection = this.createAnonymConnection();

    const adminOptions = createAuthForClientCredentialsFlow({
      credentials: {
        clientId: this.clientID,
        clientSecret: this.clientSecret,
      },
      fetch,
      host: URL_AUTH,
      projectKey: this.projectKey,
      scopes: this.scopes,
    });

    const adminClient = this.getAdminClient(adminOptions);

    this.adminConnection = this.getConnection(adminClient);
  }

  private getAdminClient(middleware: Middleware): Client {
    return new ClientBuilder()
      .withProjectKey(this.projectKey)
      .withHttpMiddleware(httpMiddlewareOptions)
      .withMiddleware(middleware)
      .build();
  }

  private getAuthOption(credentials: UserCredentials): Middleware {
    const { email, password } = credentials || { email: '', password: '' };
    const defaultOptions = this.getDefaultOptions(TokenType.AUTH);
    const authOptions: PasswordAuthMiddlewareOptions = {
      ...defaultOptions,
      credentials: {
        ...defaultOptions.credentials,
        user: {
          password,
          username: email,
        },
      },
    };
    return createAuthForPasswordFlow(authOptions);
  }

  private getClient(middleware: Middleware, token: TokenType): Client {
    const defaultOptions = this.getDefaultOptions(token);
    const opt: RefreshAuthMiddlewareOptions = {
      ...defaultOptions,
      refreshToken: token,
    };
    return new ClientBuilder()
      .withProjectKey(this.projectKey)
      .withHttpMiddleware(httpMiddlewareOptions)
      .withMiddleware(middleware)
      .withRefreshTokenFlow(opt)
      .build();
  }

  private getConnection(client: Client): ByProjectKeyRequestBuilder {
    return createApiBuilderFromCtpClient(client).withProjectKey({ projectKey: this.projectKey });
  }

  private getDefaultOptions(tokenType: TokenType): AuthMiddlewareOptions {
    return {
      credentials: {
        clientId: this.clientID,
        clientSecret: this.clientSecret,
      },
      fetch,
      host: URL_AUTH,
      projectKey: this.projectKey,
      scopes: this.scopes,
      tokenCache: USE_SAVE_TOKEN ? getTokenCache(tokenType) : undefined,
    };
  }

  public adminRoot(): ByProjectKeyRequestBuilder {
    return this.adminConnection;
  }

  public apiRoot(): ByProjectKeyRequestBuilder {
    let client = this.authConnection && this.isAuth ? this.authConnection : this.anonymConnection;
    if (!client) {
      client = this.createAnonymConnection();
    }
    return client;
  }

  public approveAuth(): boolean {
    this.isAuth = true;
    return this.isAuth;
  }

  public createAnonymConnection(): ByProjectKeyRequestBuilder {
    const defaultOptions = this.getDefaultOptions(TokenType.ANONYM);
    const anonymOptions = createAuthForAnonymousSessionFlow(defaultOptions);
    const anonymClient = this.getClient(anonymOptions, TokenType.ANONYM);
    this.anonymConnection = this.getConnection(anonymClient);

    return this.anonymConnection;
  }

  public createAuthConnection(credentials: UserCredentials): ByProjectKeyRequestBuilder {
    if (!this.authConnection || (this.authConnection && !this.isAuth)) {
      const authOptions = this.getAuthOption(credentials);
      const authClient = this.getClient(authOptions, TokenType.AUTH);
      this.authConnection = this.getConnection(authClient);
    }
    return this.authConnection;
  }

  public deleteAuthConnection(): boolean {
    this.authConnection = null;
    this.isAuth = false;
    this.anonymConnection = this.createAnonymConnection();
    return this.authConnection === null;
  }
}
