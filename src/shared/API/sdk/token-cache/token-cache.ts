import type { TokenCache, TokenStore } from '@commercetools/sdk-client-v2';

import getStore from '@/shared/Store/Store.ts';
import { setAnonymToken, setAuthToken } from '@/shared/Store/actions.ts';

import type { TokenTypeType } from '../../types/type.ts';

import { TokenType } from '../../types/type.ts';

export class MyTokenCache implements TokenCache {
  private myCache: TokenStore = {
    expirationTime: 0,
    refreshToken: undefined,
    token: '',
  };

  private name: string;

  constructor(name: string) {
    this.name = name;
    const soreData = getStore().getState();
    if (this.name === TokenType.ANONYM && soreData.anonymToken) {
      this.myCache = soreData.anonymToken;
    } else if (this.name === TokenType.AUTH && soreData.authToken) {
      this.myCache = soreData.authToken;
    }
  }

  private saveToken(): void {
    if (this.myCache.token) {
      if (this.name === TokenType.ANONYM) {
        getStore().dispatch(setAnonymToken(this.myCache));
      } else if (this.name === TokenType.AUTH) {
        getStore().dispatch(setAuthToken(this.myCache));
      }
    }
  }

  public clear(): void {
    this.myCache = {
      expirationTime: 0,
      refreshToken: undefined,
      token: '',
    };
    if (this.name === TokenType.ANONYM) {
      getStore().dispatch(setAnonymToken(null));
    } else if (this.name === TokenType.AUTH) {
      getStore().dispatch(setAuthToken(null));
    }
  }

  public get(): TokenStore {
    return this.myCache;
  }

  public isExist(): boolean {
    return this.myCache.token !== '' || this.myCache.refreshToken !== undefined;
  }

  public set(newCache: TokenStore): void {
    Object.assign(this.myCache, newCache);
    this.saveToken();
  }
}

const createTokenCache = (name: string): MyTokenCache => new MyTokenCache(name);

const anonymTokenCache = createTokenCache(TokenType.ANONYM);
const authTokenCache = createTokenCache(TokenType.AUTH);

export default function getTokenCache(tokenType?: TokenTypeType): MyTokenCache {
  return tokenType === TokenType.AUTH ? authTokenCache : anonymTokenCache;
}
