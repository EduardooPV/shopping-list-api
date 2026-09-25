import { IGetResumeByIdResponse } from './get-resume-list-by-id-dto';

interface IGetResumeByIdViewModelResponse {
  shoppingListId?: string;
  doneItemsCount: number;
  pendingItemsCount: number;
  totalAmount: number;
}

class GetResumeByIdViewModel {
  static toHTTP(data: IGetResumeByIdResponse): IGetResumeByIdViewModelResponse {
    return {
      shoppingListId: data.shoppingListId,
      doneItemsCount: data.doneItemsCount,
      pendingItemsCount: data.pendingItemsCount,
      totalAmount: data.sumItemsCount,
    };
  }
}

export { GetResumeByIdViewModel };
