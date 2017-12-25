import { IConfig as Config } from 'config';
import { SERVER_CONFIG_TYPE, SERVER_RESPONSE_TYPE } from 'types';
import * as Router from 'koa-router';
import * as Koa from 'koa';
import { Connection, Document, Model } from 'mongoose';

export interface IConfig extends Config {
}

export interface ILogger {
  winston: any;
  log(level: string, message: string, metadata?: any): void;
}

export interface IServer {
  configuration(config: SERVER_CONFIG_TYPE): void
  start(): void
}

export interface IRouter {
  start(app: Koa): void
}

export interface IDataBase {
  types: any
  connect(): void
  getDb(): Connection
}

export interface IValidator {
  valid(query: string, validators: any[][]): {isValid: boolean, errors: Object}
}

export interface IUser extends Document {
  toCommonObject(): any
  checkPassword(password: string): boolean
}

export interface IUserConstructor extends Model<IUser> {
  checkUser(email: string): Promise<boolean>
  isPasswordValid(password: string): any
  new(): IUser
}

export interface IHelperConstructor {
  hasAuth<Middleware>(context: Koa.Context, next: Function): Promise<void>
  new(): any
}

export interface IRoutable {
  bindRoutes(router: Router): void
}

export interface IStaticResponsible {
  error(error: any): SERVER_RESPONSE_TYPE
  success(data?: any): SERVER_RESPONSE_TYPE
  new(): any
}

