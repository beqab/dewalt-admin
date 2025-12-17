import { useQuery } from "@tanstack/react-query";
import { categoriesService } from "../services/categoriesService";
import QUERY_KEYS from "@/lib/querykeys";
import { ChildCategoryResponse } from "../types";

export const useGetChildCategoryById = (id: string, enabled: boolean = true) => {
  return useQuery<ChildCategoryResponse>({
    queryKey: QUERY_KEYS.CATEGORIES.CHILD_CATEGORIES.BY_ID(id),
    queryFn: () => categoriesService.getChildCategoryById.get(id),
    enabled: enabled && !!id,
  });
};

