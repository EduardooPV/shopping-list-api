import { IncomingMessage, ServerResponse } from 'http';
import { DateTimeHelper } from 'shared/utils/format-date-time';

class LoggerMiddleware {
  public static handle(request: IncomingMessage, response: ServerResponse): void {
    const { method, url } = request;
    const timestamp = DateTimeHelper.format(new Date());

    console.log(`[${timestamp}] >> ${method} ${url}`);

    response.on('finish', () => {
      console.log(`[${timestamp}] << ${method} ${url} [${response.statusCode}]`);
    });
  }
}

export { LoggerMiddleware };
