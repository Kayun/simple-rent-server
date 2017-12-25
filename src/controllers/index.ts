import { ContainerModule, interfaces } from 'inversify';

import { IRoutable } from 'interfaces';
import { CONTROLLER_TYPE } from 'types';

import { UserController } from './UserController'
import { AuthController } from './AuthController'

let controllersContainer = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
  bind<IRoutable>(CONTROLLER_TYPE).to(UserController);
  bind<IRoutable>(CONTROLLER_TYPE).to(AuthController);
})

export default controllersContainer;
