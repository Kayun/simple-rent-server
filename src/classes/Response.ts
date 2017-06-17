import { injectable, inject } from 'inversify';
import { IStaticResponsible } from 'interfaces';
import { SERVER_RESPONSE_TYPE } from 'types';

@injectable()
export class Response {
  static error(error: any): SERVER_RESPONSE_TYPE {
    return {
      version: '1',
      error: error,
      result: '1'
    }
  }
  static success(): SERVER_RESPONSE_TYPE {
    return {
      version: '1',
      error: null,
      result: '1'
    }
  }

  constructor() {

  }
}
