import * as Koa from 'koa';


declare module 'koa' {
  interface Context {
    csrf: string;
  }
}

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


declare var CSRF: CSRF.ICsrfConstructor;

export default CSRF;
