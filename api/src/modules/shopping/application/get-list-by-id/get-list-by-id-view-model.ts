import { ShoppingList } from 'modules/shopping/domain/entities/shopping-list';

interface IGetListByIdViewModelResponse {
  id: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class GetListByIdViewModel {
  static toHTTP(list: ShoppingList): IGetListByIdViewModelResponse {
    return {
      id: list.id,
      name: list.name,
      createdAt: list.createdAt,
      updatedAt: list.updatedAt,
    };
  }
}

export { GetListByIdViewModel };
