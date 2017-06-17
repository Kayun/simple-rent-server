import { Middleware } from 'koa';

export const CONFIG_TYPE = Symbol('Config');
export const LOGGER_TYPE = Symbol('Logger');
export const SERVER_TYPE = Symbol('Server');
export const DATA_BASE_TYPE = Symbol('DataBase');
export const ROUTER_TYPE = Symbol('Router');
export const CONTROLLER_TYPE = Symbol('Controller');
export const FACTORY_USER_CONSTRUCTOR = Symbol('Factory<IUserConstructor>');

export type SERVER_CONFIG_TYPE = {
  middlewares?: Array<Middleware>
}

export type CONFIG_OPTIONS_TYPE = {
  version: string,
  server: CONFIG_OPTIONS_SERVER_TYPE,
  logs: CONFIG_OPTIONS_LOGS_TYPE,
  secret: string[],
  session: CONFIG_OPTIONS_SESSION_TYPE
  db: CONFIG_OPTIONS_MONGO_TYPE,
  crypto: CONFIG_OPTIONS_CRYPTO_TYPE
}

export type CONFIG_OPTIONS_SERVER_TYPE = {
  host: string
  port: number,
  apiPrefix: string
}

export type CONFIG_OPTIONS_MONGO_TYPE = {
  host: string
  port: number,
  name: string,
  options?: Object
}

export type CONFIG_OPTIONS_LOGS_TYPE = {
  error?: string,
  info?: string
}

export type CONFIG_OPTIONS_CRYPTO_TYPE = {
  salt: {
    size: number
  },
  hash: {
    size: number,
    iterations: number,
    digest: string
  }
}

export type CONFIG_OPTIONS_SESSION_TYPE = {
  key?: string,
  maxAge?: number | 'session',
  overwrite?: boolean,
  signed?: boolean,
  httpOnly?: boolean,
  decode?: (string: string) => any
  encode?: (body: any) => string,
  store?: {
    get: () => any,
    set: (value: any) => void,
    remove: () => void
  }
}

export type SERVER_RESPONSE_TYPE = {
  error: string,
  result: any
  version: string
}
