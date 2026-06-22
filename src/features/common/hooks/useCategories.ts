import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '@/features/courses/services/category.service';
import { queryKeys } from '@/lib/query-keys';

export function useCategories() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => categoryService.getCategories(),
  });

  const createMutation = useMutation({
    mutationFn: (data: { name: string; slug: string; iconName: string }) =>
      categoryService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; slug?: string; iconName?: string } }) =>
      categoryService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });

  return {
    categories: query.data?.data,
    isLoading: query.isLoading,
    error: query.error,
    create: createMutation.mutate,
    isCreatePending: createMutation.isPending,
    update: updateMutation.mutate,
    isUpdatePending: updateMutation.isPending,
    deleteCategory: deleteMutation.mutate,
    isDeletePending: deleteMutation.isPending,
  };
}
