import { injectable, inject } from 'inversify';
import { randomBytes, pbkdf2Sync } from 'crypto';
import { Schema, Connection, Model, SchemaOptions } from 'mongoose';

import { DATA_BASE_TYPE, CONFIG_TYPE, CONFIG_OPTIONS_CRYPTO_TYPE, VALIDATOR_TYPE } from 'types';
import { IDataBase, IUser, IConfig, IValidator } from 'interfaces';

export class User extends Schema {

  constructor(
    option: SchemaOptions = {},
    @inject(CONFIG_TYPE) private config: IConfig,
    @inject(VALIDATOR_TYPE) private validator: IValidator
  ) {
    super({
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
      },
      hash: {
        type: String,
        required: true
      },
      salt: {
        type: String,
        required: true
      }
    }, Object.assign({
      id: true,
      toObject: {
        transform: toObjectTransform
      }
    }, option));

    this.index({ email: 1 }, { unique: true });

    this.methods = {
      checkPassword,
      toCommonObject: toCommonObjectTransform
    };

    this.statics = {
      checkUser,
      isPasswordValid
    };

    this.virtual('password').set(setPassword).get(getPassword);

    const CRYPTO_CONFIG = config.get<CONFIG_OPTIONS_CRYPTO_TYPE>('crypto');
    const EXCLUDE_FIELD = ['hash', 'salt', '__v', '_id'];

    function setPassword(password: string) {
      let { salt: { size } } = CRYPTO_CONFIG;

      if (password) {
        (<any>this).salt = randomBytes(size).toString('base64');
        (<any>this).hash = passwordHashing(password, (<any>this).salt);
        (<any>this).originalPassword = password;
        return;
      }

      (<any>this).hash = undefined;
      (<any>this).salt = undefined;
    }

    function getPassword() {
      return (<any>this).originalPassword;
    }

    function checkPassword(password: string): boolean {
      if (!password.length || !(<any>this).hash) {
        return false;
      }

      return passwordHashing(password, (<any>this).salt) === (<any>this).hash;
    }

    async function checkUser(email: string): Promise<boolean> {
      let user = await (<any>this).model('User').findOne({ email });
      return Boolean(user);
    }

    function isPasswordValid(password: string): any {
      let { length } = config.get<any>('validators.password');

      return validator.valid(password, [
        ['length', length, `Пароль пользователя должен быть не менее ${length} символов.`]
      ]);
    }

    function toCommonObjectTransform() {
      let object = (<any>this).toObject();

      delete object.email;

      return object;
    }

    function toObjectTransform(doc: any, ret: any): Object {
      ret.id = ret._id;

      for (let field of EXCLUDE_FIELD) {
        delete ret[field];
      }

      return ret;
    }

    function passwordHashing(password: string, salt: string): string {
      let { hash: { iterations, size, digest } } = CRYPTO_CONFIG;
      return pbkdf2Sync(password, salt, iterations, size, digest).toString('base64')
    }
  }



}
