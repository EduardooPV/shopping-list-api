import type { OpenAPI } from 'shared/types/openapi';
import { baseDoc } from './base';
import { OpenApiPathMerger } from './merge';

import { createUserDocs } from 'modules/users/infrastructure/http/docs/create-user-docs';
import { deleteUserDocs } from 'modules/users/infrastructure/http/docs/delete-user-docs';
import { getUserDocs } from 'modules/users/infrastructure/http/docs/get-user-docs';
import { updateUserDocs } from 'modules/users/infrastructure/http/docs/update-user-docs';
import { createListDocs } from 'modules/shopping/infrastructure/http/docs/create-list-docs';
import { deleteListByIdDocs } from 'modules/shopping/infrastructure/http/docs/delete-list-by-id-docs';
import { getAllListsDocs } from 'modules/shopping/infrastructure/http/docs/get-all-list-docs';
import { updateListByIdDocs } from 'modules/shopping/infrastructure/http/docs/update-list-by-id-docs';
import { loginUserDocs } from 'modules/auth/infrastructure/http/docs/login-user-docs';
import { logoutUserDocs } from 'modules/auth/infrastructure/http/docs/logout-user-docs';
import { refreshTokenDocs } from 'modules/auth/infrastructure/http/docs/refresh-token-docs';
import { createItemDocs } from 'modules/item/infrastructure/http/docs/create-item-docs';
import { getAllItemsByShoppingIdDocs } from 'modules/item/infrastructure/http/docs/get-all-items-by-shopping-id-docs';
import { deleteItemByIdDocs } from 'modules/item/infrastructure/http/docs/delete-item-by-id-docs';
import { updateItemByIdDocs } from 'modules/item/infrastructure/http/docs/update-item-by-id-docs';

const allDocsModules = [
  createUserDocs,
  deleteUserDocs,
  getUserDocs,
  updateUserDocs,
  createListDocs,
  deleteListByIdDocs,
  getAllListsDocs,
  updateListByIdDocs,
  loginUserDocs,
  logoutUserDocs,
  refreshTokenDocs,
  createItemDocs,
  deleteItemByIdDocs,
  getAllItemsByShoppingIdDocs,
  updateItemByIdDocs,
];

class OpenApiSpecBuilder {
  private static cached: OpenAPI.Document | null = null;

  static async build(): Promise<OpenAPI.Document> {
    if (this.cached) return this.cached;

    const mergedPaths = OpenApiPathMerger.merge(baseDoc.paths ?? {}, ...allDocsModules);

    this.cached = {
      ...baseDoc,
      paths: mergedPaths,
    };

    return this.cached;
  }

  static clearCache(): void {
    this.cached = null;
  }
}

export { OpenApiSpecBuilder };
