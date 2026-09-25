import type { IncomingMessage, ServerResponse } from 'node:http';
import { httpRequestDuration, httpRequestsTotal } from 'core/http/utils/metrics';

export type ReqWithMetrics = IncomingMessage & { metricsRoute?: string };

class MetricsRecorderMiddleware {
  public static async handle(
    req: ReqWithMetrics,
    res: ServerResponse,
    next: () => Promise<void>,
  ): Promise<void> {
    if (req.url?.startsWith('/metrics') ?? false) return next();

    const method = (req.method ?? 'GET').toUpperCase();
    const endTimer = httpRequestDuration.startTimer({ method });

    const onDone = (): void => {
      const labels = {
        method,
        route: req.metricsRoute ?? 'unknown',
        status: String(res.statusCode || 0),
      };
      httpRequestsTotal.inc(labels);
      endTimer(labels);
    };

    res.once('finish', onDone);
    res.once('close', onDone);

    await next();
  }
}

export { MetricsRecorderMiddleware };
