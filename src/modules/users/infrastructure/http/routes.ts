import { IncomingMessage, ServerResponse } from 'http';
import { Router } from 'core/http/router';
import { EnsureAuthenticatedMiddleware } from 'modules/auth/infrastructure/http/middlewares/ensure-authenticated';

import { PostgresUsersRepository } from 'modules/users/infrastructure/database/postgres-users-repository';

import { CreateUserUseCase } from 'modules/users/application/create-user/create-user-use-case';
import { DeleteUserUseCase } from 'modules/users/application/delete-user/delete-user-use-case';
import { GetUserUseCase } from 'modules/users/application/get-user/get-user-use-case';
import { UpdateUserUseCase } from 'modules/users/application/update-user/update-user-use-case';

import { CreateUserController } from 'modules/users/infrastructure/http/controllers/create-user-controller';
import { DeleteUserController } from 'modules/users/infrastructure/http/controllers/delete-user-controller';
import { UpdateUserController } from 'modules/users/infrastructure/http/controllers/update-user-controller';
import { GetUserController } from 'modules/users/infrastructure/http/controllers/get-user-controller';

class UserRoutes {
  private static usersRepository = new PostgresUsersRepository();
  private static getUserController = new GetUserController(
    new GetUserUseCase(UserRoutes.usersRepository),
  );
  private static createUserController = new CreateUserController(
    new CreateUserUseCase(UserRoutes.usersRepository),
  );
  private static deleteUserByIdController = new DeleteUserController(
    new DeleteUserUseCase(UserRoutes.usersRepository),
  );
  private static updateUserController = new UpdateUserController(
    new UpdateUserUseCase(UserRoutes.usersRepository),
  );

  static register(router: Router): void {
    router.register({
      method: 'GET',
      path: '/users/me',
      middlewares: [EnsureAuthenticatedMiddleware.handle],
      handler: (req: IncomingMessage, res: ServerResponse) =>
        UserRoutes.getUserController.handle(req, res),
    });

    router.register({
      method: 'POST',
      path: '/users',
      handler: (req: IncomingMessage, res: ServerResponse) =>
        UserRoutes.createUserController.handle(req, res),
    });

    router.register({
      method: 'DELETE',
      path: '/users/me',
      middlewares: [EnsureAuthenticatedMiddleware.handle],
      handler: (req: IncomingMessage, res: ServerResponse) =>
        UserRoutes.deleteUserByIdController.handle(req, res),
    });

    router.register({
      method: 'PUT',
      path: '/users/me',
      middlewares: [EnsureAuthenticatedMiddleware.handle],
      handler: (req: IncomingMessage, res: ServerResponse) =>
        UserRoutes.updateUserController.handle(req, res),
    });
  }
}

export { UserRoutes };
