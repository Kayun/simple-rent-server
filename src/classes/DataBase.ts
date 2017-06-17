import { injectable, inject } from 'inversify';
import * as mongoose from 'mongoose';

import { IDataBase, IConfig, ILogger } from 'interfaces';
import { CONFIG_TYPE, CONFIG_OPTIONS_MONGO_TYPE, LOGGER_TYPE } from 'types';

@injectable()
export class DataBase implements IDataBase {

  private db: mongoose.Connection;

  private readonly DB_CONFIG = this.config.get<CONFIG_OPTIONS_MONGO_TYPE>('db');

  public constructor (
    @inject(CONFIG_TYPE) private config: IConfig,
    @inject(LOGGER_TYPE) private logger: ILogger
  ) {

    (<any>mongoose).Promise = Promise;
    this.db = mongoose.createConnection();

    this.db.on('open', this.onOpen.bind(this));
    this.db.on('error', this.onError.bind(this));
    this.db.on('close', this.onClose.bind(this));
  }

  public connect(): void {
    let { host, port, name, options } = this.DB_CONFIG;
    this.db.open(host, name, port, options);
  }

  public getDb(): mongoose.Connection {
    return this.db;
  }

  private onOpen(): void {
    let { host, port, name } = this.DB_CONFIG;
    this.logger.log('info', `Connect to database on http://${host}:${port}/${name}`);
  }

  private onError(error: mongoose.Error): void {
    this.logger.log('error', error.message);
  }

  private onClose(): void {
    this.logger.log('info', 'Database disconnected');
  }
}
