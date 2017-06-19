import * as Koa from 'koa';
import * as passport from 'koa-passport';

import { IDataBase } from 'interfaces';

import { getHelpers } from './helpers';
import { localStrategy } from './strategies';

export default (app: Koa, dbConnection: IDataBase) => {
  const DB = dbConnection.getDb();
  let { serializeUser, deserializeUser  } = getHelpers(DB);

  passport.serializeUser(serializeUser);
  passport.deserializeUser(deserializeUser);

  passport.use(localStrategy(DB));

  app.use(passport.initialize());
  app.use(passport.session());
}
