import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesService } from "../services/categoriesService";
import { ReorderChildCategoriesDto } from "../types";
import QUERY_KEYS from "@/lib/querykeys";
import { toast } from "sonner";
import { ApiErrorResponse } from "@/lib/apiClient";

export const useReorderChildCategories = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ReorderChildCategoriesDto) =>
      categoriesService.reorderChildCategories.patch(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CATEGORIES.CHILD_CATEGORIES.ALL,
      });
      toast.success("ქვე-კატეგორიების თანმიმდევრობა წარმატებით შეიცვალა!");
    },
    onError: (error: ApiErrorResponse) => {
      toast.error(
        error.message ||
          "ქვე-კატეგორიების თანმიმდევრობის შეცვლა ვერ მოხერხდა. გთხოვთ სცადოთ თავიდან."
      );
    },
  });
};
