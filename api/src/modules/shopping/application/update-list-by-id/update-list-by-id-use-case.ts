import { ShoppingList } from 'modules/shopping/domain/entities/shopping-list';
import { ListNotFound } from 'modules/shopping/domain/errors/list-not-found';
import { IShoppingList } from 'modules/shopping/domain/repositories/shopping-list-repository';
import { IUpdateListByIdDTO } from './update-list-by-id-dto';
import { NoPermission } from 'shared/errors/no-permission';

class UpdateListByIdUseCase {
  constructor(private shoppingListRepository: IShoppingList) {}

  async execute(data: IUpdateListByIdDTO): Promise<ShoppingList> {
    const listExist = await this.shoppingListRepository.getListById(data.listId);

    if (listExist === null) throw new ListNotFound();

    if (listExist.userId !== data.userId) {
      throw new NoPermission();
    }

    ShoppingList.create(data.userId, data.name);

    return await this.shoppingListRepository.updateListById(data);
  }
}

export { UpdateListByIdUseCase };
