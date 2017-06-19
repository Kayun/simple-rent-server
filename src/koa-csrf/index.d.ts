import * as Koa from 'koa';
import ICsrfConstructor = CSRF.ICsrfConstructor;

declare namespace CSRF {

  export interface ICsrfOptions {
    invalidSessionSecretMessage: string;
    invalidSessionSecretStatusCode: number;
    invalidTokenMessage: string;
    invalidTokenStatusCode: number;
    excludedMethods: Array<string>,
    disableQuery: boolean
  }

  export interface ICsrfConstructor {
    new(opts: ICsrfOptions): ICsrf
  }

  export interface ICsrf {
    middleware(ctx: Koa.Context, next: Function): void
  }
}


declare var CSRF: ICsrfConstructor;

export default CSRF;
