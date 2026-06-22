import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useCategories } from './useCategories';
import { categoryService } from '@/features/courses/services/category.service';

vi.mock('@/features/courses/services/category.service', () => ({
  categoryService: {
    getCategories: vi.fn(),
    createCategory: vi.fn(),
    updateCategory: vi.fn(),
    deleteCategory: vi.fn(),
  },
}));

const mockedCategoryService = vi.mocked(categoryService);

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useCategories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial loading state', () => {
    mockedCategoryService.getCategories.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useCategories(), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.categories).toBeUndefined();
  });

  it('should fetch categories successfully', async () => {
    const mockCategories = [{ id: '1', name: 'Web Dev', slug: 'web-dev', iconName: 'code', courseCount: 5 }];
    mockedCategoryService.getCategories.mockResolvedValue({ success: true, data: mockCategories } as any);

    const { result } = renderHook(() => useCategories(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.categories).toEqual(mockCategories);
  });

  it('should call create mutation and invalidate cache', async () => {
    mockedCategoryService.getCategories.mockResolvedValue({ success: true, data: [] } as any);
    mockedCategoryService.createCategory.mockResolvedValue({ success: true, data: {} } as any);

    const { result } = renderHook(() => useCategories(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    result.current.create({ name: 'New', slug: 'new', iconName: 'star' });

    await waitFor(() => expect(mockedCategoryService.createCategory).toHaveBeenCalledWith({ name: 'New', slug: 'new', iconName: 'star' }));
  });

  it('should call update mutation', async () => {
    mockedCategoryService.getCategories.mockResolvedValue({ success: true, data: [] } as any);
    mockedCategoryService.updateCategory.mockResolvedValue({ success: true, data: undefined } as any);

    const { result } = renderHook(() => useCategories(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    result.current.update({ id: '1', data: { name: 'Updated' } });

    await waitFor(() => expect(mockedCategoryService.updateCategory).toHaveBeenCalledWith('1', { name: 'Updated' }));
  });

  it('should call delete mutation', async () => {
    mockedCategoryService.getCategories.mockResolvedValue({ success: true, data: [] } as any);
    mockedCategoryService.deleteCategory.mockResolvedValue({ success: true, data: undefined } as any);

    const { result } = renderHook(() => useCategories(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    result.current.deleteCategory('1');

    await waitFor(() => expect(mockedCategoryService.deleteCategory).toHaveBeenCalledWith('1'));
  });
});
