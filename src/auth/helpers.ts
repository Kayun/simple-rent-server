import { Connection } from 'mongoose';

import { IUserConstructor } from 'interfaces';

export let getHelpers = (db: Connection): any => {

  function serializeUser(user: any, done: Function): void {
    done(null, user.id)
  }

  async function deserializeUser(id: string, done: Function): Promise<void> {
    let User = db.model('User') as IUserConstructor;

    try {
      const USER = await User.findById(id)
      done(null, USER)
    } catch (error) {
      done(error)
    }
  }

  return {
    serializeUser,
    deserializeUser
  }

}
