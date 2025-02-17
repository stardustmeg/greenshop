import type { UserCredentials } from '@/shared/types/user';

import getStore from '@/shared/Store/Store.ts';
import { setAnonymousId, setAuthToken, switchIsUserLoggedIn } from '@/shared/Store/actions.ts';
import { type ByProjectKeyRequestBuilder, createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import {
  type AnonymousAuthMiddlewareOptions,
  type AuthMiddlewareOptions,
  type Client,
  ClientBuilder,
  type HttpMiddlewareOptions,
  type PasswordAuthMiddlewareOptions,
  type RefreshAuthMiddlewareOptions,
} from '@commercetools/sdk-client-v2';
import { v4 as uuid } from 'uuid';

import type { TokenTypeType } from '../types/type.ts';

import { TokenType } from '../types/type.ts';
import getTokenCache from './token-cache/token-cache.ts';

const PROJECT_KEY = import.meta.env.VITE_APP_CTP_PROJECT_KEY;
const SCOPES = import.meta.env.VITE_APP_CTP_SCOPES;
const CLIENT_ID = import.meta.env.VITE_APP_CTP_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_APP_CTP_CLIENT_SECRET;
const URL_AUTH = import.meta.env.VITE_APP_CTP_AUTH_URL;
const URL_HTTP = import.meta.env.VITE_APP_CTP_API_URL;
const USE_SAVE_TOKEN = true;

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: URL_HTTP,
};

export class ApiClient {
  private anonymConnection: ByProjectKeyRequestBuilder | null = null;

  private authConnection: ByProjectKeyRequestBuilder | null = null;

  private clientID: string;

  private clientSecret: string;

  private isAuth = false;

  private projectKey: string;

  private scopes: string[];

  constructor() {
    this.projectKey = PROJECT_KEY;
    this.clientID = CLIENT_ID;
    this.clientSecret = CLIENT_SECRET;
    this.scopes = SCOPES.split(' ');
    if (USE_SAVE_TOKEN) {
      this.checkSaveToken();
    }

    if (USE_SAVE_TOKEN && getStore().getState().authToken) {
      this.authConnection = this.createAuthConnectionWithRefreshToken();
      this.isAuth = true;
    } else {
      this.anonymConnection = this.createAnonymConnection();
    }
  }

  private addAuthMiddleware(
    defaultOptions: AuthMiddlewareOptions,
    credentials: UserCredentials,
  ): PasswordAuthMiddlewareOptions {
    const { email, password } = credentials || { email: '', password: '' };
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
    return authOptions;
  }

  private addRefreshMiddleware(
    tokenType: TokenTypeType,
    client: ClientBuilder,
    defaultOptions: AuthMiddlewareOptions,
  ): void {
    const { refreshToken } = getTokenCache(tokenType).get();
    if (refreshToken) {
      const optionsRefreshToken: RefreshAuthMiddlewareOptions = {
        ...defaultOptions,
        refreshToken,
      };
      client.withRefreshTokenFlow(optionsRefreshToken);
    }
  }

  private checkSaveToken(): void {
    const { anonymousToken, authToken } = getStore().getState();
    if (authToken && authToken.expirationTime < Date.now()) {
      localStorage.clear();
      getStore().dispatch(setAuthToken(null));
      getStore().dispatch(switchIsUserLoggedIn(false));
      getTokenCache(TokenType.AUTH).clear();
    }
    if (anonymousToken && anonymousToken.expirationTime < Date.now()) {
      localStorage.clear();
      getStore().dispatch(setAnonymousId(null));
      getTokenCache(TokenType.ANONYM).clear();
    }
  }

  private createAnonymConnection(): ByProjectKeyRequestBuilder {
    const defaultOptions = this.getDefaultOptions(TokenType.ANONYM);
    const client = this.getDefaultClient();

    let anonymOptions: AnonymousAuthMiddlewareOptions = {
      ...defaultOptions,
      credentials: {
        ...defaultOptions.credentials,
      },
    };

    const saveAnonymousId = getStore().getState().anonymousId;
    if (!saveAnonymousId) {
      const anonymousId = uuid();

      anonymOptions = {
        ...defaultOptions,
        credentials: {
          ...defaultOptions.credentials,
          anonymousId,
        },
      };
      getStore().dispatch(setAnonymousId(anonymousId));
    }

    client.withAnonymousSessionFlow(anonymOptions);

    this.anonymConnection = this.getConnection(client.build());
    return this.anonymConnection;
  }

  private createAuthConnectionWithRefreshToken(): ByProjectKeyRequestBuilder {
    const defaultOptions = this.getDefaultOptions(TokenType.AUTH);
    const client = this.getDefaultClient();

    this.addRefreshMiddleware(TokenType.AUTH, client, defaultOptions);

    this.authConnection = this.getConnection(client.build());

    return this.authConnection;
  }

  private deleteAnonymConnection(): boolean {
    this.anonymConnection = null;
    getTokenCache(TokenType.ANONYM).clear();

    return this.anonymConnection === null;
  }

  private getConnection(client: Client): ByProjectKeyRequestBuilder {
    return createApiBuilderFromCtpClient(client).withProjectKey({ projectKey: this.projectKey });
  }

  private getDefaultClient(): ClientBuilder {
    return new ClientBuilder().withProjectKey(this.projectKey).withHttpMiddleware(httpMiddlewareOptions);
  }

  private getDefaultOptions(tokenType?: TokenTypeType): AuthMiddlewareOptions {
    return {
      credentials: {
        clientId: this.clientID,
        clientSecret: this.clientSecret,
      },
      host: URL_AUTH,
      projectKey: this.projectKey,
      scopes: this.scopes,
      tokenCache: USE_SAVE_TOKEN ? getTokenCache(tokenType) : undefined,
    };
  }

  public apiRoot(): ByProjectKeyRequestBuilder {
    let client =
      (this.authConnection && this.isAuth) || (this.authConnection && !this.anonymConnection)
        ? this.authConnection
        : this.anonymConnection;

    if (!client) {
      client = this.createAnonymConnection();
    }
    return client;
  }

  public approveAuth(): boolean {
    this.isAuth = true;
    this.deleteAnonymConnection();
    return this.isAuth;
  }

  public createAuthConnection(credentials: UserCredentials): ByProjectKeyRequestBuilder {
    if (!this.authConnection || (this.authConnection && !this.isAuth)) {
      const defaultOptions = this.getDefaultOptions(TokenType.AUTH);
      const client = this.getDefaultClient();

      const authOptions = this.addAuthMiddleware(defaultOptions, credentials);

      client.withPasswordFlow(authOptions);
      this.authConnection = this.getConnection(client.build());
    }
    return this.authConnection;
  }

  public deleteAuthConnection(): boolean {
    this.authConnection = null;
    this.isAuth = false;
    getTokenCache(TokenType.AUTH).clear();
    this.anonymConnection = this.createAnonymConnection();

    return this.authConnection === null;
  }
}

const createClient = (): ApiClient => new ApiClient();

const apiClient = createClient();

export default function getApiClient(): ApiClient {
  return apiClient;
}
