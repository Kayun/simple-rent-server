import { injectable, inject } from 'inversify';
import { Middleware, Context } from 'koa';
import * as passport from 'koa-passport';

import { method } from 'decorators';
import { IRoutable, IUserConstructor, IUser, IStaticResponsible, ILogger } from 'interfaces';
import { FACTORY_USER_CONSTRUCTOR_TYPE, RESPONSE_CONSTRUCTOR_TYPE, LOGGER_TYPE } from 'types';
import { USER_COOKIE } from 'types/constants';

import { Controller } from 'classes';

@injectable()
export class AuthController extends Controller {

  private User: IUserConstructor

  constructor(
    @inject(FACTORY_USER_CONSTRUCTOR_TYPE) private userFactory: () => IUserConstructor,
    @inject(RESPONSE_CONSTRUCTOR_TYPE) private Response: IStaticResponsible,
    @inject(LOGGER_TYPE) private logger: ILogger
  ) {
    super()
    this.User = userFactory();
  }

  @method('post', '/login')
  public async login<Middleware>(context: Context, next: Function): Promise<void> {
    let { email, password } = context.request.body;

    if (!email) {
      context.body = this.Response.error({ email: 'Обязательное поле' });
      context.status = 401;
      return;
    }

    if (!password) {
      context.body = this.Response.error({ password: 'Обязательное поле' });
      context.status = 401;
      return;
    }

    let authenticate = passport.authenticate('local', async (error: any, user: any, info: any) => {
      if (error) {
        this.logger.log('error', error);
        throw error;
      } else if (user === false || user === undefined) {
        context.body = this.Response.error({ login: info.message });
        context.status = 401;
      } else {
        context.body = this.Response.success(user.toObject());
        context.sessionHandler.regenerateId();
        context.cookies.set(USER_COOKIE, user.get('id'), { httpOnly: false });
        await context.login(user);
      }
    })

    await authenticate.call(this, context, next);
  }

  @method('post', '/logout')
  public logout<Middleware>(context: Context): void {
    try {
      context.logout();
      context.session.passport = null;
      context.cookies.set(USER_COOKIE, null);
      context.body = this.Response.success();
    } catch (error) {
      context.body = this.Response.error(error.message);
      context.status = 500;
    }
  }

  @method('get', '/key')
  public getApiKey<Middleware>(context: Context): void {
    context.body = this.Response.success({ key: context.csrf });
  }
}
