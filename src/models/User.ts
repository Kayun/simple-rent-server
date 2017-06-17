import { injectable, inject } from 'inversify';
import { randomBytes, pbkdf2Sync } from 'crypto';
import { Schema, Connection, Model, SchemaOptions } from 'mongoose';

import { DATA_BASE_TYPE, CONFIG_TYPE, CONFIG_OPTIONS_CRYPTO_TYPE } from 'types';
import { IDataBase, IUser, IConfig } from 'interfaces';

export class User extends Schema {

  constructor(
    option: SchemaOptions = {},
    @inject(CONFIG_TYPE) private config: IConfig
  ) {
    super({
      email: {
        type: String,
        required: true
      },
      passwordHash: {
        type: String,
        required: true
      },
      salt: {
        type: String,
        required: true
      }
    }, option);

    const CRYPTO_CONFIG = config.get<CONFIG_OPTIONS_CRYPTO_TYPE>('crypto');

    this.methods = {};

    this.statics = {
      checkUser
    };

    this.virtual('password').set(setPassword).get(getPassword);

    function setPassword(password: string) {
      let { salt, hash: { size, iterations, digest } } = CRYPTO_CONFIG;

      if (password) {
        (<any>this).salt = randomBytes(salt.size).toString('base64');
        (<any>this).passwordHash = pbkdf2Sync(password, (<any>this).salt, iterations, size, digest).toString('base64')
        return;
      }

      (<any>this).passwordHash = undefined;
      (<any>this).salt = undefined;
    }

    function getPassword() {
      return 'pass'
    }

    function checkUser(email: string): Promise<boolean> {
        return new Promise<boolean>(async resolve => {
          let user = await (<any>this).model('User').findOne({ email });
          resolve(Boolean(user));
        })
      }
  }



}
