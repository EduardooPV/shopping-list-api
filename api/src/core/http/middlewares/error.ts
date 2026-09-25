import { IncomingMessage, ServerResponse } from 'http';
import { HttpErrorHandler } from 'core/http/utils/handle-http-error';

class ErrorMiddleware {
  public static async handle(
    _request: IncomingMessage,
    response: ServerResponse,
    next: () => Promise<void>,
  ): Promise<void> {
    try {
      await next();
    } catch (error) {
      if (response.headersSent) {
        console.error('Error after headers sent. Destroying socket.', error);
        response.destroy();
        return;
      }

      HttpErrorHandler.handle(error, response);
    }
  }
}

export { ErrorMiddleware };
