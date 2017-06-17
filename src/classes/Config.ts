import { injectable } from 'inversify';
import * as config from 'config';
import { IConfig } from 'interfaces';

@injectable()
export class Config implements IConfig {

  public util: config.IUtil = config.util

  public get<T>(property: string): T {
    return config.get<T>(property);
  }

  public has(property: string): boolean {
    return config.has(property);
  }
}
