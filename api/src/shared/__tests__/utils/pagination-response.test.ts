import { describe, it, beforeEach, expect } from '@jest/globals';
import { Pagination } from 'shared/utils/pagination-response';

describe('Pagination', () => {
  let items: string[];

  beforeEach(() => {
    items = ['item1', 'item2', 'item3'];
  });

  it('should return a valid pagination response', () => {
    const total = 10;
    const page = 1;
    const perPage = 3;

    const response = Pagination.build({ items, total, page, perPage });

    expect(response).toHaveProperty('items', items);
    expect(response.pagination.total).toBe(total);
    expect(response.pagination.page).toBe(page);
    expect(response.pagination.perPage).toBe(perPage);
    expect(response.pagination.totalPages).toBe(Math.ceil(total / perPage));
    expect(response.pagination.hasNextPage).toBe(true);
    expect(response.pagination.hasPreviousPage).toBe(false);
  });

  it('should indicate previous page when current page > 1', () => {
    const total = 20;
    const page = 2;
    const perPage = 5;

    const response = Pagination.build({ items, total, page, perPage });

    expect(response.pagination.hasPreviousPage).toBe(true);
    expect(response.pagination.hasNextPage).toBe(true);
  });

  it('should indicate no next page when current page equals total pages', () => {
    const total = 10;
    const page = 2;
    const perPage = 5;

    const response = Pagination.build({ items, total, page, perPage });

    expect(response.pagination.hasNextPage).toBe(false);
    expect(response.pagination.hasPreviousPage).toBe(true);
  });

  it('should handle total smaller than perPage correctly', () => {
    const total = 2;
    const page = 1;
    const perPage = 5;

    const response = Pagination.build({ items, total, page, perPage });

    expect(response.pagination.totalPages).toBe(1);
    expect(response.pagination.hasNextPage).toBe(false);
    expect(response.pagination.hasPreviousPage).toBe(false);
  });

  it('should handle empty items array correctly', () => {
    const response = Pagination.build({ items: [], total: 0, page: 1, perPage: 10 });

    expect(response.items).toEqual([]);
    expect(response.pagination.total).toBe(0);
    expect(response.pagination.totalPages).toBe(0);
    expect(response.pagination.hasNextPage).toBe(false);
    expect(response.pagination.hasPreviousPage).toBe(false);
  });
});
