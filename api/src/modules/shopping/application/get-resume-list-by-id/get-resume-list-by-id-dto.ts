interface IGetResumeByIdDTO {
  userId?: string;
  listId?: string;
}

interface IGetResumeByIdResponse {
  shoppingListId?: string;
  doneItemsCount: number;
  pendingItemsCount: number;
  sumItemsCount: number;
}

export { IGetResumeByIdDTO, IGetResumeByIdResponse };
