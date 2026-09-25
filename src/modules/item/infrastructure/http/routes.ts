import { IncomingMessage, ServerResponse } from 'http';
import { Router } from 'core/http/router';
import { EnsureAuthenticatedMiddleware } from 'modules/auth/infrastructure/http/middlewares/ensure-authenticated';
import { CreateItemUseCase } from 'modules/item/application/create-item/create-item-use-case';
import { PostgresItemListRepository } from 'modules/item/infrastructure/database/postgres-item-list-repository';
import { CreateItemController } from 'modules/item/infrastructure/http/controllers/create-item-controller';
import { GetAllItemsByShoppingIdUseCase } from 'modules/item/application/get-all-items-by-shopping-id/get-all-items-by-shopping-id-use-case';
import { GetAllItemsByShoppingIdController } from 'modules/item/infrastructure/http/controllers/get-all-items-by-shopping-id-controller';
import { DeleteItemByIdUseCase } from 'modules/item/application/delete-item-by-id/delete-item-by-id-use-case';
import { DeleteItemByIdController } from 'modules/item/infrastructure/http/controllers/delete-item-by-id-controller';
import { PostgresShoppingListRepository } from 'modules/shopping/infrastructure/database/postgres-shopping-list-repository';
import { UpdateItemByIdUseCase } from 'modules/item/application/update-item-by-id/update-item-by-id-use-case';
import { UpdateItemByIdController } from 'modules/item/infrastructure/http/controllers/update-item-by-id-controller';

class ItemRoutes {
  private static itemListRepository = new PostgresItemListRepository();
  private static shoppingListRepository = new PostgresShoppingListRepository();

  private static createItemUseCase = new CreateItemUseCase(
    ItemRoutes.itemListRepository,
    ItemRoutes.shoppingListRepository,
  );
  private static createListController = new CreateItemController(ItemRoutes.createItemUseCase);

  private static getAllItemsUseCase = new GetAllItemsByShoppingIdUseCase(
    ItemRoutes.itemListRepository,
    ItemRoutes.shoppingListRepository,
  );
  private static getAllItemsController = new GetAllItemsByShoppingIdController(
    ItemRoutes.getAllItemsUseCase,
  );

  private static deleteItemByIdUseCase = new DeleteItemByIdUseCase(
    ItemRoutes.itemListRepository,
    ItemRoutes.shoppingListRepository,
  );
  private static deleteItemByIdController = new DeleteItemByIdController(
    ItemRoutes.deleteItemByIdUseCase,
  );

  private static updateItemByIdUseCase = new UpdateItemByIdUseCase(
    ItemRoutes.itemListRepository,
    ItemRoutes.shoppingListRepository,
  );
  private static updateItemByIdController = new UpdateItemByIdController(
    ItemRoutes.updateItemByIdUseCase,
  );

  static register(router: Router): void {
    router.register({
      method: 'POST',
      path: '/lists/:shoppingListId/items',
      middlewares: [EnsureAuthenticatedMiddleware.handle],
      handler: (req: IncomingMessage, res: ServerResponse) =>
        ItemRoutes.createListController.handle(req, res),
    });

    router.register({
      method: 'GET',
      path: '/lists/:shoppingListId/items',
      middlewares: [EnsureAuthenticatedMiddleware.handle],
      handler: (req: IncomingMessage, res: ServerResponse) =>
        ItemRoutes.getAllItemsController.handle(req, res),
    });

    router.register({
      method: 'DELETE',
      path: '/lists/:shoppingListId/items/:itemId',
      middlewares: [EnsureAuthenticatedMiddleware.handle],
      handler: (req: IncomingMessage, res: ServerResponse) =>
        ItemRoutes.deleteItemByIdController.handle(req, res),
    });

    router.register({
      method: 'PUT',
      path: '/lists/:shoppingListId/items/:itemId',
      middlewares: [EnsureAuthenticatedMiddleware.handle],
      handler: (req: IncomingMessage, res: ServerResponse) =>
        ItemRoutes.updateItemByIdController.handle(req, res),
    });
  }
}

export { ItemRoutes };
