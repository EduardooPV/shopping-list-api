import { AppError } from 'shared/errors/app-error';
import { HttpStatusMapper } from './errors/catalog';

class HttpErrorMapper {
  static toHttp(error: unknown): { status: number; body: unknown } {
    if (error instanceof AppError) {
      const status = HttpStatusMapper.CODE_TO_STATUS[error.code] ?? 400;
      return {
        status,
        body: {
          error: {
            code: error.code,
            message: error.message,
            details: error.details,
          },
        },
      };
    }

    return {
      status: 500,
      body: {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal Server Error',
        },
      },
    };
  }
}

export { HttpErrorMapper };
