import { GetMetricsController } from 'core/http/controllers/metrics/get-metrics';
import { Router } from 'core/http/router';

class MetricsRoutes {
  private static getMetricsController = new GetMetricsController();

  static register(router: Router): void {
    router.register({
      method: 'GET',
      path: '/metrics',
      handler: MetricsRoutes.getMetricsController.handle,
    });
  }
}

export { MetricsRoutes };
