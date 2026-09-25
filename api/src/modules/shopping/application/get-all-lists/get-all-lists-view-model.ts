import { ShoppingList } from 'modules/shopping/domain/entities/shopping-list';

interface IGetAllListsViewModelResponse {
  name: string;
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class GetAllListsViewModel {
  static toHTTP(list: ShoppingList): IGetAllListsViewModelResponse {
    return {
      name: list.name,
      id: list.id,
      createdAt: list.createdAt,
      updatedAt: list.updatedAt,
    };
  }
}

export { GetAllListsViewModel };
