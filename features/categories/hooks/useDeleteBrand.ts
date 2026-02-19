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
      toast.success("ბრენდი წარმატებით წაიშალა!");
    },
    onError: (error: ApiErrorResponse) => {
      toast.error(error.message || "ბრენდის წაშლა ვერ მოხერხდა. გთხოვთ სცადოთ თავიდან.");
    },
  });
};
