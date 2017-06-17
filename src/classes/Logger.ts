import { injectable, inject } from 'inversify';
import { dirname } from 'path';
import { stat, mkdir } from 'mz/fs';
import * as winston from 'winston';

import { IConfig } from 'interfaces';
import { CONFIG_TYPE, CONFIG_OPTIONS_LOGS_TYPE } from 'types';

@injectable()
export class Logger {

  public winston: any

  private transports: Array<winston.TransportInstance> = []

  public constructor(
    @inject(CONFIG_TYPE) private config: IConfig
  ) {
    const LOG_LEVEL = config.get<CONFIG_OPTIONS_LOGS_TYPE>('logs');
    const ENV = config.util.getEnv('NODE_ENV');
    let flag = null;

    if (ENV === 'development') {
      this.transports.push(new (winston.transports.Console)())
    }

    for (let level of Object.keys(LOG_LEVEL)) {
      let filename = LOG_LEVEL[level];
      let folder = dirname(filename);

      stat(folder).catch(async error => {
        if (error.code === 'ENOENT') {
          await mkdir(folder);
        }
      })
      this.transports.push(new (winston.transports.File)({ level, filename }))
    }
    this.winston = new (winston.Logger)({
      transports: this.transports
    })
  }

  public log(level: string, message: string, metadata?: any): void {
    this.winston.log.apply(this.winston, arguments);
  }

}
