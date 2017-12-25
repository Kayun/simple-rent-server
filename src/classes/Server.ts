import { injectable, inject } from 'inversify';
import { createServer, Server as HttpServer } from 'http';
import * as Koa from 'koa';
import * as session from 'koa-session-minimal';
import { SchemaOptions } from 'mongoose';

import auth from 'auth';

import {
  IConfig, ILogger, IServer, IDataBase, IUser, IRouter
} from 'interfaces';
import {
  CONFIG_TYPE, LOGGER_TYPE, CONFIG_OPTIONS_SERVER_TYPE, SERVER_CONFIG_TYPE,
  CONFIG_OPTIONS_SESSION_TYPE, DATA_BASE_TYPE, ROUTER_TYPE, CONFIG_OPTIONS_STORE_TYPE, STORE_TYPE
} from 'types';

import { USER_COOKIE, CSRF_COOKIE } from 'types/constants';

@injectable()
export class Server implements IServer {
  private app: Koa;

  private http: HttpServer;

  private readonly SERVER_CONFIG = this.config.get<CONFIG_OPTIONS_SERVER_TYPE>('server');

  public constructor(
    @inject(CONFIG_TYPE) private config: IConfig,
    @inject(LOGGER_TYPE) private logger: ILogger,
    @inject(DATA_BASE_TYPE) private db: IDataBase,
    @inject(ROUTER_TYPE) private router: IRouter
  ) {
    this.app = new Koa();
    this.app.keys = this.config.get<string[]>('secret');

    this.http = createServer(this.app.callback());

    this.http.on('error', this.onError.bind(this));
    this.http.on('listening', this.onListening.bind(this));
  }

  public configuration(config: SERVER_CONFIG_TYPE = {}): void {
    this.addMiddlewares(config.middlewares);
  }

  public start(): void {
    let { host, port } = this.SERVER_CONFIG;

    this.db.connect();
    this.router.start(this.app);

    this.http.listen(port, host);
  }

  private addMiddlewares(middlewares: Array<Koa.Middleware> = []): void {

    this.addSession();

    if (middlewares && middlewares.length) {
      middlewares.forEach(middleware => this.app.use(middleware));
    }

    this.app.use(async (context: any, next: any) => {
      context.cookies.set(CSRF_COOKIE, context.csrf, { httpOnly: false });

      if (!context.session.passport) {
        context.cookies.set(USER_COOKIE, null);
      }

      await next();
    })

    auth(this.app, this.db);
  }

  private onError(error: any, context: Koa.Context): void {
    this.logger.log('error', error);
  }

  private onListening(): void {
    let { address, port } = this.http.address();
    this.logger.log('info', `listen ${address} on port ${port}`);
  }

  private addSession() {
    let Store = this.config.get<any>('session.store');

    const KEY = this.config.get<string>('session.key');
    const STORE_CONFIG = Object.assign({}, this.config.get<CONFIG_OPTIONS_STORE_TYPE>('store'));
    const COOKIE_CONFIG = this.config.get<any>('cookie');


    this.app.use(session({
      key: KEY,
      store: new Store(Object.assign(STORE_CONFIG, { connection: this.db.getDb() })) as STORE_TYPE,
      cookie: COOKIE_CONFIG
    }));

  }
}
