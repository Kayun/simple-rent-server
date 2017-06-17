import { injectable, inject } from 'inversify';
import { Middleware } from 'koa';

import { method } from 'decorators';
import { IRoutable, IUserConstructor, IUser } from 'interfaces';
import { FACTORY_USER_CONSTRUCTOR } from 'types';

import { Controller } from 'classes';

@injectable()
export class UserController extends Controller {

  constructor(
    @inject(FACTORY_USER_CONSTRUCTOR) private userFactory: () => IUserConstructor
  ) {
    super()

    let User = userFactory();

    let user: IUser = new User({
      email: 'kayun.artem@gmail.com',
      password: '123456'
    });

    user.save()
      .then(result => {
        console.log(result);
      })
      .catch(error => {
        console.log(error.errors);
      })
  }
}
