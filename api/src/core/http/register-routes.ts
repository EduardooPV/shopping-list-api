import { Router } from './router';
import { AuthRoutes } from 'modules/auth/infrastructure/routes';
import { DocsRoutes } from 'core/http/routes/docs';
import { MetricsRoutes } from 'core/http/routes/metrics';
import { UserRoutes } from 'modules/users/infrastructure/http/routes';
import { ShoppingRoutes } from 'modules/shopping/infrastructure/http/routes';
import { ItemRoutes } from 'modules/item/infrastructure/http/routes';

class RouteRegister {
  constructor(private readonly router: Router) {}

  public registerAll(): void {
    this.registerUserRoutes();
    this.registerAuthRoutes();
    this.registerDocsRoutes();
    this.registerMetricsRoutes();
    this.registerShoppingListRoutes();
    this.registerItemListRoutes();
  }

  private registerUserRoutes(): void {
    UserRoutes.register(this.router);
  }

  private registerAuthRoutes(): void {
    AuthRoutes.register(this.router);
  }

  private registerDocsRoutes(): void {
    DocsRoutes.register(this.router);
  }

  private registerMetricsRoutes(): void {
    MetricsRoutes.register(this.router);
  }

  private registerShoppingListRoutes(): void {
    ShoppingRoutes.register(this.router);
  }

  private registerItemListRoutes(): void {
    ItemRoutes.register(this.router);
  }
}

export { RouteRegister };
