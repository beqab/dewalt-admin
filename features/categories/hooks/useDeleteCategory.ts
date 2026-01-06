import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesService } from "../services/categoriesService";
import QUERY_KEYS from "@/lib/querykeys";
import { toast } from "sonner";
import { ApiErrorResponse } from "@/lib/apiClient";

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoriesService.deleteCategory.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CATEGORIES.CATEGORIES.ALL,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CATEGORIES.CHILD_CATEGORIES.ALL,
      });
      toast.success("Category deleted successfully!");
    },
    onError: (error: ApiErrorResponse) => {
      toast.error(
        error.message || "Failed to delete category. Please try again."
      );
    },
  });
};
