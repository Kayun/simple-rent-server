import { Context } from 'koa';
import { Response } from 'classes';

export class Helper {

  public static async hasAuth<Middleware>(context: Context, next: Function): Promise<void> {
    if (context.isAuthenticated()) {
      await next();
    } else {
      context.throw(401, null, { user: 'Пользователь не авторизирован'});
    }
  }

}
