import { ICreateListDTO } from './create-list-dto';
import { InvalidListName } from 'modules/shopping/domain/errors/invalid-list-name';
import { ShoppingList } from 'modules/shopping/domain/entities/shopping-list';
import { InvalidUserIdError } from 'modules/users/domain/errors/invalid-user-id-error';
import { IShoppingList } from 'modules/shopping/domain/repositories/shopping-list-repository';

class CreateListUseCase {
  constructor(private shoppingListRepository: IShoppingList) {}

  async execute(data: ICreateListDTO): Promise<ShoppingList> {
    if (data.userId == null) throw new InvalidUserIdError({ reason: 'missing' });

    if (data.name == null || data.name.trim().length === 0) {
      throw new InvalidListName({ reason: 'missing' });
    }

    const list = new ShoppingList(data.userId, data.name.trim(), new Date(), new Date());

    return await this.shoppingListRepository.create(list);
  }
}

export { CreateListUseCase };
