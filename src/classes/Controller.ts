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
      args = args.map((arg: any, index: number) => typeof arg === 'function' ? arg.bind(this) : arg);
      router[method](...args);
    }
  }

}
