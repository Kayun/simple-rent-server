import { Context } from 'koa';
import { Response } from 'classes';

export class Helper {

  public static async hasAuth<Middleware>(context: Context, next: Function): Promise<void> {
    if (context.isAuthenticated()) {
      await next();
    } else {
      context.status = 401;
      context.body = Response.error(context.message);
    }
  }

}
