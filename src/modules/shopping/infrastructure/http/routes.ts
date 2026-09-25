import { IncomingMessage, ServerResponse } from 'http';
import { PostgresShoppingListRespository } from 'modules/shopping/infrastructure/database/postgres-shopping-list-repository';
import { CreateListUseCase } from 'modules/shopping/application/create-list/create-list-use-case';
import { CreateListController } from './controllers/create-list-controller';
import { Router } from 'core/http/router';
import { EnsureAuthenticatedMiddleware } from 'modules/auth/infrastructure/http/middlewares/ensure-authenticated';
import { GetAllListsUseCase } from 'modules/shopping/application/get-all-lists/get-all-lists-use-case';
import { GetAllListsController } from './controllers/get-all-list-controller';
import { DeleteListByIdUseCase } from 'modules/shopping/application/delete-list-by-id/delete-list-by-id-use-case';
import { DeleteListByIdController } from './controllers/delete-list-by-id-controller';
import { UpdateListByIdUseCase } from '../../application/update-list-by-id/update-list-by-id-use-case';
import { UpdateListByIdController } from './controllers/update-list-by-id-controller';
import { GetResumeByIdUseCase } from '../../application/get-resume-list-by-id/get-resume-list-by-id-use-case';
import { GetResumeByIdController } from './controllers/get-resume-list-by-id-controller';
import { PostgresShoppingListStatsRespository } from '../database/postgres-shopping-list-stats-repository';

class ShoppingRoutes {
  private static shoppingListRepository = new PostgresShoppingListRespository();
  private static shoppingListStatsRepository = new PostgresShoppingListStatsRespository();

  private static createListUseCase = new CreateListUseCase(ShoppingRoutes.shoppingListRepository);
  private static createListController = new CreateListController(ShoppingRoutes.createListUseCase);
  private static getAllListsUsecase = new GetAllListsUseCase(ShoppingRoutes.shoppingListRepository);
  private static getAllListsController = new GetAllListsController(
    ShoppingRoutes.getAllListsUsecase,
  );
  private static deleteListByIdUsecase = new DeleteListByIdUseCase(
    ShoppingRoutes.shoppingListRepository,
  );
  private static deleteListByIdController = new DeleteListByIdController(
    ShoppingRoutes.deleteListByIdUsecase,
  );
  private static updateListByIdUsecase = new UpdateListByIdUseCase(
    ShoppingRoutes.shoppingListRepository,
  );
  private static updateListByIdController = new UpdateListByIdController(
    ShoppingRoutes.updateListByIdUsecase,
  );

  private static getResumeByIdUseCase = new GetResumeByIdUseCase(
    ShoppingRoutes.shoppingListRepository,
    ShoppingRoutes.shoppingListStatsRepository,
  );
  private static getResumeByIdController = new GetResumeByIdController(
    ShoppingRoutes.getResumeByIdUseCase,
  );

  static register(router: Router): void {
    router.register({
      method: 'POST',
      path: '/lists',
      middlewares: [EnsureAuthenticatedMiddleware.handle],
      handler: (req: IncomingMessage, res: ServerResponse) =>
        ShoppingRoutes.createListController.handle(req, res),
    });

    router.register({
      method: 'GET',
      path: '/lists',
      middlewares: [EnsureAuthenticatedMiddleware.handle],
      handler: (req: IncomingMessage, res: ServerResponse) =>
        ShoppingRoutes.getAllListsController.handle(req, res),
    });

    router.register({
      method: 'DELETE',
      path: '/lists/:id',
      middlewares: [EnsureAuthenticatedMiddleware.handle],
      handler: (req: IncomingMessage, res: ServerResponse) =>
        ShoppingRoutes.deleteListByIdController.handle(req, res),
    });

    router.register({
      method: 'PUT',
      path: '/lists/:id',
      middlewares: [EnsureAuthenticatedMiddleware.handle],
      handler: (req: IncomingMessage, res: ServerResponse) =>
        ShoppingRoutes.updateListByIdController.handle(req, res),
    });

    router.register({
      method: 'GET',
      path: '/lists/:id/resume',
      middlewares: [EnsureAuthenticatedMiddleware.handle],
      handler: (req: IncomingMessage, res: ServerResponse) =>
        ShoppingRoutes.getResumeByIdController.handle(req, res),
    });
  }
}

export { ShoppingRoutes };
