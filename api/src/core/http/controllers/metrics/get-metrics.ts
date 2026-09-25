import type { IncomingMessage, ServerResponse } from 'node:http';
import { registry } from 'core/http/utils/metrics';

class GetMetricsController {
  public async handle(_req: IncomingMessage, res: ServerResponse): Promise<void> {
    const body = await registry.metrics();

    res.statusCode = 200;
    res.setHeader('Content-Type', registry.contentType);
    res.end(body);
  }
}

export { GetMetricsController };
