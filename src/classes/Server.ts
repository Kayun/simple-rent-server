import { injectable, inject } from 'inversify';
import { createServer, Server as HttpServer } from 'http';
import * as Koa from 'koa';
import * as koaSession from 'koa-session';
import * as passport from 'koa-passport';
import { SchemaOptions } from 'mongoose';

import {
  IConfig, ILogger, IServer, IDataBase, IUser, IRouter
} from 'interfaces';
import {
  CONFIG_TYPE, LOGGER_TYPE, CONFIG_OPTIONS_SERVER_TYPE, SERVER_CONFIG_TYPE,
  CONFIG_OPTIONS_SESSION_TYPE, DATA_BASE_TYPE, FACTORY_USER_CONSTRUCTOR, ROUTER_TYPE
} from 'types';

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
    if (middlewares && middlewares.length) {
      middlewares.forEach(middleware => this.app.use(middleware));
    }

    const SESSION_CONFIG = Object.assign({}, this.config.get<CONFIG_OPTIONS_SESSION_TYPE>('session'));

    this.app.use(koaSession(SESSION_CONFIG, this.app));
    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }

  private onError(error: any, context: Koa.Context): void {
    this.logger.log('error', error);
  }

  private onListening(): void {
    let { address, port } = this.http.address();
    this.logger.log('info', `listen ${address} on port ${port}`);
  }
}
