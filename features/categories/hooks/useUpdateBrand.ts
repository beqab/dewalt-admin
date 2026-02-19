import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesService } from "../services/categoriesService";
import { UpdateBrandDto } from "../types";
import QUERY_KEYS from "@/lib/querykeys";
import { toast } from "sonner";
import { ApiErrorResponse } from "@/lib/apiClient";

export const useUpdateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBrandDto }) =>
      categoriesService.updateBrand.patch(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CATEGORIES.BRANDS.ALL,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CATEGORIES.BRANDS.BY_ID(variables.id),
      });
      toast.success("ბრენდი წარმატებით განახლდა!");
    },
    onError: (error: ApiErrorResponse) => {
      toast.error(error.message || "ბრენდის განახლება ვერ მოხერხდა. გთხოვთ სცადოთ თავიდან.");
    },
  });
};
