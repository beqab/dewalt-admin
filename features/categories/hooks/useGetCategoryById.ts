import { useQuery } from "@tanstack/react-query";
import { categoriesService } from "../services/categoriesService";
import QUERY_KEYS from "@/lib/querykeys";
import { CategoryResponse } from "../types";

export const useGetCategoryById = (id: string, enabled: boolean = true) => {
  return useQuery<CategoryResponse>({
    queryKey: QUERY_KEYS.CATEGORIES.CATEGORIES.BY_ID(id),
    queryFn: () => categoriesService.getCategoryById.get(id),
    enabled: enabled && !!id,
  });
};

