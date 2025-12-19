import { useQuery } from "@tanstack/react-query";
import { categoriesService } from "../services/categoriesService";
import QUERY_KEYS from "@/lib/querykeys";
import { ChildCategoryResponse } from "../types";

export const useGetChildCategories = (brandId?: string, categoryId?: string) => {
  return useQuery<ChildCategoryResponse[]>({
    queryKey: brandId && categoryId
      ? QUERY_KEYS.CATEGORIES.CHILD_CATEGORIES.BY_CATEGORY(categoryId)
      : QUERY_KEYS.CATEGORIES.CHILD_CATEGORIES.ALL,
    queryFn: () => categoriesService.getChildCategories.get(brandId, categoryId),
  });
};

