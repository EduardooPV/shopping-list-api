import { ShoppingList } from 'modules/shopping/domain/entities/shopping-list';

interface ICreateListViewModelResponse {
  name: string;
  id: string;
}

class CreateListViewModel {
  static toHTTP(list: ShoppingList): ICreateListViewModelResponse {
    return {
      name: list.name,
      id: list.id,
    };
  }
}

export { CreateListViewModel };
