import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesService } from "../services/categoriesService";
import { SetChildCategoryGroupDto } from "../types";
import QUERY_KEYS from "@/lib/querykeys";

export const useSetChildCategoryGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SetChildCategoryGroupDto) =>
      categoriesService.setChildCategoryGroup.post(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CATEGORIES.CHILD_CATEGORIES.ALL,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CATEGORIES.CHILD_CATEGORIES.BY_BRAND_CATEGORY(
          variables.brandId,
          variables.categoryId
        ),
      });
    },
  });
};
