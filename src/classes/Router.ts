import { injectable, inject, multiInject } from 'inversify';
import * as KoaRouter from 'koa-router';
import * as Koa from 'koa';

import { IRouter, IConfig, IRoutable } from 'interfaces';
import { CONFIG_TYPE, CONTROLLER_TYPE } from 'types';
import { Controller } from 'classes';

@injectable()
export class Router implements IRouter {

  private prefix = this.config.get<string>('server.apiPrefix');

  private router: KoaRouter

  constructor(
    @inject(CONFIG_TYPE) private config: IConfig,
    @multiInject(CONTROLLER_TYPE) controllers: Controller[]
  ) {
    this.router = new KoaRouter();
    this.router.prefix(this.prefix);

    controllers.forEach((Controller: Controller) => {
      Controller.bindRoutes(this.router);
    })
  }

  public start(app: Koa): void {
    app.use(this.router.routes());
    app.use(this.router.allowedMethods());
  }

}
