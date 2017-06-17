import { injectable } from 'inversify';
import { IRoutable } from 'interfaces';
import * as KoaRouter from 'koa-router';

@injectable()
export abstract class Controller implements IRoutable {

  protected routes: Object;

  public bindRoutes(router: KoaRouter): void {
    for (let key in this.routes) {
      if (!this.routes.hasOwnProperty(key)) {
        continue;
      }

      let { method, args } = this.routes[key];
      router[method](...args);
    }
  }

}
