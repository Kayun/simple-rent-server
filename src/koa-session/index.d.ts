import * as Koa from 'koa';

declare function KoaSession(opts: any, app: Koa): Koa.Middleware;
declare namespace KoaSession {}

export = KoaSession;
