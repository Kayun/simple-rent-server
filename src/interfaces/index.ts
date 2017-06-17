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
  connect(): void
  getDb(): Connection
}

export interface IUser extends Document {
  test(): void
}

export interface IUserConstructor extends Model<IUser> {
  checkUser(email: string): Promise<boolean>
  new(): IUser
}

export interface IRoutable {
  bindRoutes(router: Router): void
}

export interface IStaticResponsible<C extends new () => C> {
  error(error: any): SERVER_RESPONSE_TYPE
  success(data: any): SERVER_RESPONSE_TYPE
  new(): any
}

