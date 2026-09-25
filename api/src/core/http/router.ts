import { IncomingMessage, ServerResponse } from 'http';

import { AppError } from 'shared/errors/app-error';
import { HttpMethod } from 'core/http/interfaces/http-method';
import { RouteDefinition } from 'core/http/interfaces/route-definition';

type Params = Record<string, string>;

type ReqWithMeta = IncomingMessage & { params?: Params; metricsRoute?: string };

class Router {
  private routes: RouteDefinition[] = [];

  register(route: RouteDefinition): void {
    this.routes.push(route);
  }

  async resolve(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const method = req.method as HttpMethod | undefined;
    const url = req.url;

    if (!method || url == null) {
      throw new AppError('BAD_REQUEST', 'Bad Request');
    }

    const { pathname } = new URL(`http://localhost${url}`);

    const candidates = this.routes
      .filter((r) => this.sameLength(r.path, pathname) && this.pathMatches(r.path, pathname))
      .sort((a, b) => {
        const aParams = (a.path.match(/:\w+/g) || []).length;
        const bParams = (b.path.match(/:\w+/g) || []).length;
        return aParams - bParams;
      });

    if (candidates.length === 0) {
      (req as ReqWithMeta).metricsRoute = '__not_found__';
      throw new AppError('ROUTE_NOT_FOUND', 'Not Found');
    }

    const allowed = new Set<HttpMethod>(candidates.map((r) => r.method));
    if (!allowed.has(method)) {
      (req as ReqWithMeta).metricsRoute = candidates[0]?.path ?? 'unknown';
      res.setHeader('Allow', Array.from(allowed).join(', '));
      throw new AppError('METHOD_NOT_ALLOWED', 'Method Not Allowed');
    }

    const route = candidates.find((r) => r.method === method)!;
    const params = this.extractParams(route.path, pathname);
    (req as IncomingMessage & { params?: Params }).params = params;

    const reqWithMeta = req as ReqWithMeta;
    reqWithMeta.params = params;
    reqWithMeta.metricsRoute = route.path;

    if (route.middlewares?.length != null) {
      for (const mw of route.middlewares) {
        let nextCalled = false;

        await new Promise<void>((resolve, reject) => {
          try {
            void mw(reqWithMeta, res, () => {
              nextCalled = true;
              resolve();
            });
          } catch (err) {
            reject(err);
          }
        });

        if (!nextCalled) {
          return;
        }
      }
    }

    await route.handler(reqWithMeta, res);
  }

  private sameLength(a: string, b: string): boolean {
    return a.split('/').filter(Boolean).length === b.split('/').filter(Boolean).length;
  }

  private pathMatches(routePath: string, actualPath: string): boolean {
    if (routePath === actualPath) return true;
    const routeSegments = routePath.split('/').filter(Boolean);
    const pathSegments = actualPath.split('/').filter(Boolean);
    for (let i = 0; i < routeSegments.length; i++) {
      const r = routeSegments[i];
      const p = pathSegments[i];
      if (r.startsWith(':')) continue;
      if (r !== p) return false;
    }
    return true;
  }

  private extractParams(routePath: string, actualPath: string): Params {
    const params: Params = {};
    const routeSegments = routePath.split('/').filter(Boolean);
    const pathSegments = actualPath.split('/').filter(Boolean);
    for (let i = 0; i < routeSegments.length; i++) {
      const r = routeSegments[i];
      if (r.startsWith(':')) params[r.slice(1)] = pathSegments[i];
    }
    return params;
  }
}

export { Router };
