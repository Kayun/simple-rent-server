import { ContainerModule, interfaces } from 'inversify';
import { SchemaOptions } from 'mongoose';

import { IDataBase, IUserConstructor, IConfig } from 'interfaces';
import { DATA_BASE_TYPE, FACTORY_USER_CONSTRUCTOR_TYPE, CONFIG_TYPE, VALIDATOR_TYPE } from 'types';

import { User } from './User';

let modelFactory = (modelName: string, ModelSchema: any, ...depsTypes: any[]) => {
  return (context: interfaces.Context) => {
    let db = context.container.get<IDataBase>(DATA_BASE_TYPE).getDb();
    let modelNames = db.modelNames();

    let deps = depsTypes.map(TYPE => context.container.get(TYPE));

    return (option?: SchemaOptions) => {
      if (modelNames.indexOf(modelName) === -1) {
        return (<any>db).model(modelName, new ModelSchema(option, ...deps));
      } else {
        return (<any>db).model(modelName);
      }
    }
  }
}

let modelsContainer = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {

  bind<interfaces.Factory<IUserConstructor>>(FACTORY_USER_CONSTRUCTOR_TYPE)
    .toFactory<IUserConstructor>(modelFactory('User', User, CONFIG_TYPE, VALIDATOR_TYPE));
})

export default modelsContainer;
