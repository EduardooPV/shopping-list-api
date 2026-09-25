import { ZodError } from 'zod';
import { AppError } from 'shared/errors/app-error';
import { HttpStatusMapper } from './catalog';
import { HttpError } from 'core/http/interfaces/http-error';

class HttpErrorMapper {
  public static toHttp(error: unknown): HttpError {
    if (error instanceof AppError) {
      return {
        status: HttpStatusMapper.getStatusFor(error.code),
        body: {
          error: {
            code: error.code,
            message: error.message,
            details: error.details,
          },
        },
      };
    }

    if (error instanceof ZodError) {
      return {
        status: HttpStatusMapper.getStatusFor('VALIDATION_ERROR'),
        body: {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data.',
            issues: error.issues.map((i) => ({
              path: i.path,
              message: i.message,
            })),
          },
        },
      };
    }

    if (error instanceof SyntaxError) {
      return {
        status: HttpStatusMapper.getStatusFor('BAD_REQUEST'),
        body: {
          error: {
            code: 'BAD_REQUEST',
            message: 'Malformed JSON body.',
          },
        },
      };
    }

    return {
      status: HttpStatusMapper.getStatusFor('INTERNAL_ERROR'),
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
