import { injectable, inject } from 'inversify';
import { Middleware, Context } from 'koa';

import { method } from 'decorators';
import {
  IRoutable, IUserConstructor, IUser, ILogger, IStaticResponsible, IValidator, IDataBase
} from 'interfaces';
import {
  FACTORY_USER_CONSTRUCTOR_TYPE, RESPONSE_CONSTRUCTOR_TYPE, LOGGER_TYPE, VALIDATOR_TYPE,
  DATA_BASE_TYPE
} from 'types';

import { Controller } from 'classes';

@injectable()
export class UserController extends Controller {

  private User: IUserConstructor

  constructor(
    @inject(FACTORY_USER_CONSTRUCTOR_TYPE) private userFactory: () => IUserConstructor,
    @inject(RESPONSE_CONSTRUCTOR_TYPE) private Response: IStaticResponsible,
    @inject(LOGGER_TYPE) private logger: ILogger,
    @inject(DATA_BASE_TYPE) private db: IDataBase
  ) {
    super()
    this.User = userFactory();
  }

  @method('get', '/users')
  public async getUsers<Middleware>(context: Context): Promise<void> {
    let query = await this.User.find({});
    let users = query.map(user => user.toObject());

    context.body = this.Response.success(users);
  }

  @method('get', '/users/:id')
  public async getUse<Middleware>(context: Context): Promise<void> {
    let { id } = context.params;

    if (!this.db.types.ObjectId.isValid(id)) {
      return context.throw(400, null, { user: 'ID пользователя должен быть валидным ObjectID'});
    }

    if (context.isUnauthenticated()) {
      return context.throw(401, null, { user: 'Пользователь не авторизирован'});
    }

    let user = await this.User.findById(id);

    if (!user) {
      return context.throw(404);
    }

    let data;

    if (context.session.passport && id === context.session.passport.user) {
      data = user.toObject();
    } else {
      data = user.toCommonObject();
    }

    context.body = this.Response.success(data);
  }

  @method('post', '/users')
  public async singUp<Middleware>(context: Context): Promise<void> {
    let { email, password, autoLogin } = context.request.body;

    try {
      let isUserExist = await this.User.checkUser(email);

      if (isUserExist) {
        context.body = this.Response.error({
          email: 'Пользователь с такой электронной почтой уже существует'
        });
      } else {
        let { isValid, errors } = this.User.isPasswordValid(password);

        if (isValid) {
          let user: IUser = new this.User({ email, password });
          let newUser = await user.save();

          if (autoLogin) {
            context.body = this.Response.success(newUser.toObject());
            await context.login(newUser);
          } else {
            context.body = this.Response.success();
          }

        } else {
          context.body = this.Response.error({ password: errors });
        }
      }
    } catch (error) {
      throw error;
    }
  }
}
