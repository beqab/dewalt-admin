import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesService } from "../services/categoriesService";
import QUERY_KEYS from "@/lib/querykeys";
import { toast } from "sonner";
import { ApiErrorResponse } from "@/lib/apiClient";

export const useDeleteChildCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      categoriesService.deleteChildCategory.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CATEGORIES.CHILD_CATEGORIES.ALL,
      });
      toast.success("ქვე-კატეგორია წარმატებით წაიშალა!");
    },
    onError: (error: ApiErrorResponse) => {
      toast.error(
        error.message || "ქვე-კატეგორიის წაშლა ვერ მოხერხდა. გთხოვთ სცადოთ თავიდან."
      );
    },
  });
};
