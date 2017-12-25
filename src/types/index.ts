import { Middleware } from 'koa';
import { Connection } from 'mongoose';

export const CONFIG_TYPE = Symbol('Config');
export const LOGGER_TYPE = Symbol('Logger');
export const SERVER_TYPE = Symbol('Server');
export const DATA_BASE_TYPE = Symbol('DataBase');
export const ROUTER_TYPE = Symbol('Router');
export const VALIDATOR_TYPE = Symbol('Validator');
export const CONTROLLER_TYPE = Symbol('Controller');
export const RESPONSE_CONSTRUCTOR_TYPE = Symbol('Newable<Response>');
export const HELPER_CONSTRUCTOR_TYPE = Symbol('Newable<Helper>');
export const FACTORY_USER_CONSTRUCTOR_TYPE = Symbol('Factory<IUserConstructor>');

export type SERVER_CONFIG_TYPE = {
  middlewares?: Array<Middleware>
}

export type CONFIG_OPTIONS_TYPE = {
  version: string,
  server: CONFIG_OPTIONS_SERVER_TYPE,
  logs: CONFIG_OPTIONS_LOGS_TYPE,
  secret: string[],
  session: CONFIG_OPTIONS_SESSION_TYPE,
  cookie: CONFIG_OPTIONS_COOKIE_TYPE,
  store: CONFIG_OPTIONS_STORE_TYPE,
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
  store?: STORE_TYPE
}

export type CONFIG_OPTIONS_COOKIE_TYPE = {
  maxAge?: number,
  httpOnly?: boolean,
  domain?: string,
  path?: string,
  secure?: boolean
}

export type CONFIG_OPTIONS_STORE_TYPE = {
  model?: string,
  collection?: string,
  expires?: number,
  connection?: Connection
}

export type STORE_TYPE = {
  get: () => any,
  set: (value: any) => void,
  remove: () => void
}

export type SERVER_RESPONSE_TYPE = {
  error?: (string | Object | null),
  data?: (any | null)
  success: boolean
}
