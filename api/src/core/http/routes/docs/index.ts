import { DocsController } from 'core/http/controllers/docs/docs-controller';
import { OpenApiController } from 'core/http/controllers/docs/openapi-controller';
import { Router } from 'core/http/router';

class DocsRoutes {
  private static openApiController = new OpenApiController();
  private static docsController = new DocsController();

  static register(router: Router): void {
    router.register({
      path: '/openapi.json',
      method: 'GET',
      handler: (req, res) => DocsRoutes.openApiController.handle(req, res),
    });
    router.register({
      path: '/docs',
      method: 'GET',
      handler: (req, res) => DocsRoutes.docsController.handle(req, res),
    });
  }
}

export { DocsRoutes };
