import { describe, it, expect } from '@jest/globals';
import { IncomingMessage } from 'http';
import { PaginationHelper } from 'shared/utils/pagination-params';

describe('PaginationHelper', () => {
  const mockRequest = (url: string): IncomingMessage => ({ url }) as unknown as IncomingMessage;

  it('should return default values when no query params are provided', () => {
    const request = mockRequest('/');
    const result = PaginationHelper.fromRequest({ request });

    expect(result).toEqual({
      page: 1,
      perPage: 10,
      skip: 0,
      take: 10,
    });
  });

  it('should parse valid page and per_page params', () => {
    const request = mockRequest('/?page=2&per_page=5');
    const result = PaginationHelper.fromRequest({ request });

    expect(result).toEqual({
      page: 2,
      perPage: 5,
      skip: 5,
      take: 5,
    });
  });

  it('should also accept perPage instead of per_page', () => {
    const request = mockRequest('/?page=3&perPage=4');
    const result = PaginationHelper.fromRequest({ request });

    expect(result).toEqual({
      page: 3,
      perPage: 4,
      skip: 8,
      take: 4,
    });
  });

  it('should clamp page below 1 to 1', () => {
    const request = mockRequest('/?page=0&per_page=5');
    const result = PaginationHelper.fromRequest({ request });

    expect(result.page).toBe(1);
  });

  it('should clamp perPage to maxPerPage', () => {
    const request = mockRequest('/?page=1&per_page=999');
    const result = PaginationHelper.fromRequest({ request, defaultPerPage: 10, maxPerPage: 50 });

    expect(result.perPage).toBe(50);
  });

  it('should fallback to default perPage if invalid', () => {
    const request = mockRequest('/?page=2&per_page=abc');
    const result = PaginationHelper.fromRequest({ request, defaultPerPage: 10, maxPerPage: 10 });

    expect(result.perPage).toBe(1);
  });

  it('should handle NaN or invalid page values', () => {
    const request = mockRequest('/?page=abc&per_page=5');
    const result = PaginationHelper.fromRequest({ request });

    expect(result.page).toBe(1);
  });

  it('should handle NaN inside clamp returning min value', () => {
    const request = { url: '/?per_page=NaN' } as IncomingMessage;
    const result = PaginationHelper.fromRequest({ request, defaultPerPage: 10, maxPerPage: 20 });

    expect(result.perPage).toBe(1);
  });

  it('should handle undefined request.url by using default "/"', () => {
    const request = {} as IncomingMessage;
    const result = PaginationHelper.fromRequest({ request });

    expect(result).toEqual({
      page: 1,
      perPage: 10,
      skip: 0,
      take: 10,
    });
  });
});
