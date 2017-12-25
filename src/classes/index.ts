import { ContainerModule, interfaces } from 'inversify';

import * as AppInterfaces from 'interfaces';
import * as APP_TYPES from 'types';

import { Config } from './Config';
import { Logger } from './Logger';
import { Server } from './Server';
import { Response } from './Response';
import { DataBase } from './DataBase';
import { Router } from './Router';
import { Controller } from './Controller';
import { Validator } from './Validator';
import { Helper } from './Helper';

let classesContainer = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {

// Config class
  bind<AppInterfaces.IConfig>(APP_TYPES.CONFIG_TYPE).to(Config).inSingletonScope();

// Logger class
  bind<AppInterfaces.ILogger>(APP_TYPES.LOGGER_TYPE).to(Logger).inSingletonScope();

// Server class
  bind<AppInterfaces.IServer>(APP_TYPES.SERVER_TYPE).to(Server);

// DataBase class
  bind<AppInterfaces.IDataBase>(APP_TYPES.DATA_BASE_TYPE).to(DataBase).inSingletonScope();

// Router class
  bind<AppInterfaces.IRouter>(APP_TYPES.ROUTER_TYPE).to(Router).inSingletonScope();

// Validator class
  bind<AppInterfaces.IValidator>(APP_TYPES.VALIDATOR_TYPE).to(Validator).inSingletonScope();

// Response static class
  bind<interfaces.Newable<AppInterfaces.IStaticResponsible>>(APP_TYPES.RESPONSE_CONSTRUCTOR_TYPE).toConstructor(Response);

// Helper static class
  bind<interfaces.Newable<AppInterfaces.IHelperConstructor>>(APP_TYPES.HELPER_CONSTRUCTOR_TYPE).toConstructor(Helper);
});

export {
  Config,
  Logger,
  Server,
  Response,
  DataBase,
  Router,
  Controller,
  Validator,
  Helper
};

export default classesContainer;
