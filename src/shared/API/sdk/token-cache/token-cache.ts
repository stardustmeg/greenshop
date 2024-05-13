import type { TokenCache, TokenStore } from '@commercetools/sdk-client-v2';

import Cookies from 'js-cookie';

import type { TokenTypeType } from '../../types/type.ts';

import { TokenType } from '../../types/type.ts';
import { isTokenType } from '../../types/validation.ts';

const NAME = 'token-data';

export class MyTokenCache implements TokenCache {
  private myCache: TokenStore = {
    expirationTime: 0,
    refreshToken: undefined,
    token: '',
  };

  private name: string;

  constructor(name: string) {
    this.name = name;
    const soreData = Cookies.get(`${this.name}-${NAME}`);
    if (soreData) {
      const cookieData: unknown = JSON.parse(soreData);
      if (isTokenType(cookieData)) {
        const { expirationTime, refreshToken, token } = cookieData;
        if (token && refreshToken) {
          this.myCache = { expirationTime, refreshToken, token };
        }
      }
    }
  }

  private saveToken(): void {
    if (this.myCache.token) {
      const cookieData = {
        expirationTime: this.myCache.expirationTime.toString(),
        refreshToken: this.myCache.refreshToken || '',
        token: this.myCache.token,
      };
      Cookies.set(`${this.name}-${NAME}`, JSON.stringify(cookieData));
    }
  }

  public clear(): void {
    this.myCache = {
      expirationTime: 0,
      refreshToken: undefined,
      token: '',
    };
    Cookies.remove(`${this.name}-${NAME}`);
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
