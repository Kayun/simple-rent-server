import { injectable, inject } from 'inversify';
import { IStaticResponsible } from 'interfaces';
import { SERVER_RESPONSE_TYPE } from 'types';

@injectable()
export class Response {
  static error(error: any): SERVER_RESPONSE_TYPE {
    return {
      success: false,
      error: error
    }
  }
  static success(data: any = null): SERVER_RESPONSE_TYPE {
    return {
      success: true,
      data: data
    }
  }
}
