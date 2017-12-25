import 'reflect-metadata';
import * as Koa from 'koa';
import { readdirSync } from 'mz/fs';
import { IServer } from 'interfaces';
import { SERVER_TYPE } from 'types';

import container from 'inversify.config';

let modules: Array<string> = readdirSync('./src/middlewares');
let middlewares: Array<Koa.Middleware> = [];
let server: IServer = container.get<IServer>(SERVER_TYPE);

for (let module of modules) {
  middlewares.push(require(`./middlewares/${module}`).default);
}

server.configuration({ middlewares })
server.start();

