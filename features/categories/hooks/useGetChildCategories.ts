import { useQuery } from "@tanstack/react-query";
import { categoriesService } from "../services/categoriesService";
import QUERY_KEYS from "@/lib/querykeys";
import { ChildCategoryResponse } from "../types";

export const useGetChildCategories = (
  brandId?: string,
  categoryId?: string,
  options?: { enabled?: boolean }
) => {
  const hasBrandCategory = Boolean(brandId && categoryId);
  const isAll = !brandId && !categoryId;
  const enabled =
    options?.enabled ?? (hasBrandCategory ? true : isAll ? true : false);

  const queryKey = enabled
    ? hasBrandCategory
      ? QUERY_KEYS.CATEGORIES.CHILD_CATEGORIES.BY_BRAND_CATEGORY(
          brandId as string,
          categoryId as string
        )
      : isAll
        ? QUERY_KEYS.CATEGORIES.CHILD_CATEGORIES.ALL
        : ["categories", "child-categories", "disabled"]
    : ["categories", "child-categories", "disabled"];

  return useQuery<ChildCategoryResponse[]>({
    queryKey,
    queryFn: () => categoriesService.getChildCategories.get(brandId, categoryId),
    enabled,
  });
};

