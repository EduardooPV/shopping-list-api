import { ICreateListDTO } from './create-list-dto';
import { ShoppingList } from 'modules/shopping/domain/entities/shopping-list';
import { InvalidUserIdError } from 'modules/users/domain/errors/invalid-user-id-error';
import { IShoppingList } from 'modules/shopping/domain/repositories/shopping-list-repository';

class CreateListUseCase {
  constructor(private shoppingListRepository: IShoppingList) {}

  async execute(data: ICreateListDTO): Promise<ShoppingList> {
    if (data.userId == null) throw new InvalidUserIdError({ reason: 'missing' });

    const list = ShoppingList.create(data.userId, data.name ?? '');

    return await this.shoppingListRepository.create(list);
  }
}

export { CreateListUseCase };
