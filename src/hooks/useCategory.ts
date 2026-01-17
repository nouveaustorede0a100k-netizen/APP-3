import { useEffect } from 'react';
import { useCategoryStore } from '@/stores/categoryStore';

export function useCategory(categoryId: string) {
  const { currentCategory, fetchCategory, loading, error } = useCategoryStore();

  useEffect(() => {
    if (categoryId) {
      fetchCategory(categoryId);
    }
  }, [categoryId]);

  return {
    category: currentCategory,
    loading,
    error,
    refetch: () => fetchCategory(categoryId),
  };
}
