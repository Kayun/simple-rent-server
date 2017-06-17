import { ContainerModule, interfaces } from 'inversify';
import { SchemaOptions } from 'mongoose';

import { IDataBase, IUserConstructor, IConfig } from 'interfaces';
import { DATA_BASE_TYPE, FACTORY_USER_CONSTRUCTOR, CONFIG_TYPE } from 'types';

import { User } from './User';

let modelFactory = (modelName: string, ModelSchema: any) => {
  return (context: interfaces.Context) => {
    let connection = context.container.get<IDataBase>(DATA_BASE_TYPE);
    let config = context.container.get<IConfig>(CONFIG_TYPE);

    return (option?: SchemaOptions) => {
      return (<any>connection.getDb()).model(modelName, new ModelSchema(option, config));
    }
  }
}

let modelsContainer = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
  bind<interfaces.Factory<IUserConstructor>>(FACTORY_USER_CONSTRUCTOR)
    .toFactory<IUserConstructor>(modelFactory('User', User));
})

export default modelsContainer;
