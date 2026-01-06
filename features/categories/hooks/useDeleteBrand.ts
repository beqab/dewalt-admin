import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesService } from "../services/categoriesService";
import QUERY_KEYS from "@/lib/querykeys";
import { toast } from "sonner";
import { ApiErrorResponse } from "@/lib/apiClient";

export const useDeleteBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoriesService.deleteBrand.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CATEGORIES.BRANDS.ALL,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CATEGORIES.CATEGORIES.ALL,
      });
      toast.success("Brand deleted successfully!");
    },
    onError: (error: ApiErrorResponse) => {
      toast.error(error.message || "Failed to delete brand. Please try again.");
    },
  });
};
