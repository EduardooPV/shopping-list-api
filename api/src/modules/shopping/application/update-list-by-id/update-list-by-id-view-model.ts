import { ShoppingList } from 'modules/shopping/domain/entities/shopping-list';

interface IUpdateListByIdViewModelResponse {
  name: string;
  id: string;
}

class UpdateListByIdViewModel {
  static toHTTP(list: ShoppingList): IUpdateListByIdViewModelResponse {
    return {
      name: list.name,
      id: list.id,
    };
  }
}

export { UpdateListByIdViewModel };
