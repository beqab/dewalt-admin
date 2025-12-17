import { useQuery } from "@tanstack/react-query";
import { categoriesService } from "../services/categoriesService";
import QUERY_KEYS from "@/lib/querykeys";
import { CategoryResponse } from "../types";

export const useGetCategories = (brandId?: string) => {
  return useQuery<CategoryResponse[]>({
    queryKey: brandId
      ? QUERY_KEYS.CATEGORIES.CATEGORIES.BY_BRAND(brandId)
      : QUERY_KEYS.CATEGORIES.CATEGORIES.ALL,
    queryFn: () => categoriesService.getCategories.get(brandId),
  });
};

