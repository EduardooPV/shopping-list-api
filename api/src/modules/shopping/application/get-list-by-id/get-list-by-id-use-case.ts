import { ShoppingList } from 'modules/shopping/domain/entities/shopping-list';
import { InvalidListId } from 'modules/shopping/domain/errors/invalid-list-id';
import { ListNotFound } from 'modules/shopping/domain/errors/list-not-found';
import { IShoppingList } from 'modules/shopping/domain/repositories/shopping-list-repository';
import { IGetListByIdRequestDTO } from './get-list-by-id-dto';

class GetListByIdUseCase {
  constructor(private shoppingListRepository: IShoppingList) {}

  async execute(data: IGetListByIdRequestDTO): Promise<ShoppingList> {
    if (data.id == null || data.id === '') throw new InvalidListId();

    const list = await this.shoppingListRepository.getListById(data.id);

    if (!list) throw new ListNotFound();

    return list;
  }
}

export { GetListByIdUseCase };
