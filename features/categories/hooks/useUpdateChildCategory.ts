import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesService } from "../services/categoriesService";
import { UpdateChildCategoryDto } from "../types";
import QUERY_KEYS from "@/lib/querykeys";
import { toast } from "sonner";
import { ApiErrorResponse } from "@/lib/apiClient";

export const useUpdateChildCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateChildCategoryDto }) =>
      categoriesService.updateChildCategory.patch(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CATEGORIES.CHILD_CATEGORIES.ALL,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CATEGORIES.CHILD_CATEGORIES.BY_ID(variables.id),
      });
      toast.success("ქვე-კატეგორია წარმატებით განახლდა!");
    },
    onError: (error: ApiErrorResponse) => {
      toast.error(
        error.message || "ქვე-კატეგორიის განახლება ვერ მოხერხდა. გთხოვთ სცადოთ თავიდან."
      );
    },
  });
};
