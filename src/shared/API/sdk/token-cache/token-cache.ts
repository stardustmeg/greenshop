import type { TokenCache, TokenStore } from '@commercetools/sdk-client-v2';

import Cookies from 'js-cookie';

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
    const token = Cookies.get(`${this.name}-token`);
    const expirationTime = Number(Cookies.get(`${this.name}-expirationTime`));
    const refreshToken = Cookies.get(`${this.name}-refreshToken`);
    if (token && refreshToken) {
      this.myCache = { expirationTime, refreshToken, token };
    }
  }

  private saveToken(): void {
    if (this.myCache.token) {
      Cookies.set(`${this.name}-token`, this.myCache.token);
      Cookies.set(`${this.name}-expirationTime`, this.myCache.expirationTime.toString());
      Cookies.set(`${this.name}-refreshToken`, this.myCache.refreshToken || '');
    }
  }

  public clear(): void {
    this.myCache = {
      expirationTime: 0,
      refreshToken: undefined,
      token: '',
    };
    Cookies.remove(`${this.name}-token`);
    Cookies.remove(`${this.name}-expirationTime`);
    Cookies.remove(`${this.name}-refreshToken`);
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

export default function getTokenCache(tokenType?: TokenType): MyTokenCache {
  return tokenType === TokenType.AUTH || authTokenCache.isExist() ? authTokenCache : anonymTokenCache;
}
