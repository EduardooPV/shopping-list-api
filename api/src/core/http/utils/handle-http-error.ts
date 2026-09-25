import { ServerResponse } from 'http';
import { env } from 'shared/utils/env';
import { AppError } from 'shared/errors/app-error';
import { HttpErrorMapper } from 'core/http/errors/translator';

class HttpErrorHandler {
  public static handle(error: unknown, res: ServerResponse): void {
    const { status, body } = HttpErrorMapper.toHttp(error);

    if (env.nodeEnv !== 'production' && error instanceof AppError) {
      (body as { error: { stack?: string } }).error.stack = (error as Error).stack ?? '';
    }

    const json = JSON.stringify(body);
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Content-Length', Buffer.byteLength(json).toString());
    res.end(json);
  }
}

export { HttpErrorHandler };
