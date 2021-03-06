import { Middleware, Context } from 'koa';
import { Response } from 'classes';
import { SERVER_RESPONSE_TYPE } from 'types';

const errorHandle = async <Middleware>(context: Context, next: any) => {
  try {
    await next();
  } catch (error) {
    let body: SERVER_RESPONSE_TYPE;

    if (error.status) {
      let { message, ...properties } = error;

      context.response.status = error.status;
      body = Response.error({ message, properties });
    } else {
      context.response.status = 500;
      body = Response.error('Internal Server Error');
    }

    context.body = body;
  }
};

export default errorHandle;
