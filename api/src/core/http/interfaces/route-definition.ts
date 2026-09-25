import { IncomingMessage, ServerResponse } from 'http';
import { HttpMethod } from './http-method';

export type Middleware = (
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void | Promise<void>,
) => void | Promise<void>;

export interface RouteDefinition {
  method: HttpMethod;
  path: string;
  handler: (req: IncomingMessage, res: ServerResponse) => void | Promise<void>;
  middlewares?: Middleware[];
}
