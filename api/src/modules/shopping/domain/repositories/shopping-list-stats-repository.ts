interface IShoppingListStats {
  getSumAmountItemsById(id?: string): Promise<number>;
  getDoneItemsById(id?: string): Promise<number>;
  getPendingItemsById(id?: string): Promise<number>;
}

export { IShoppingListStats };
