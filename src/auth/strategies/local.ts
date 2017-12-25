import { Strategy, VerifyFunction } from 'passport-local';
import { Connection } from 'mongoose';
import { IUser } from 'interfaces';

export let localStrategy = (db: Connection): any => {

  let verify: VerifyFunction = async (email: string, password: string, done: Function): Promise<void> => {
    let User = db.model('User');

    try {
      let user = await User.findOne({ email }) as IUser;

      if (user && user.checkPassword(password)) {
        done(null, user);
      } else {
        done(null, false, { message: 'Неверый логин или пароль' });
      }
    } catch (error) {
      done(error);
    }
  }

  return new Strategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: false
  }, verify);

}
