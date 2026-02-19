import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesService } from "../services/categoriesService";
import { CreateCategoryDto } from "../types";
import QUERY_KEYS from "@/lib/querykeys";
import { toast } from "sonner";
import { ApiErrorResponse } from "@/lib/apiClient";

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCategoryDto) =>
      categoriesService.createCategory.post(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CATEGORIES.CATEGORIES.ALL,
      });
      const brandId = data.brandIds?.reduce(
        (acc: string, brand) => acc + brand._id,
        ""
      );
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CATEGORIES.CATEGORIES.BY_BRAND(brandId),
      });
      toast.success("კატეგორია წარმატებით შეიქმნა!");
    },
    onError: (error: ApiErrorResponse) => {
      toast.error(
        error.message || "კატეგორიის შექმნა ვერ მოხერხდა. გთხოვთ სცადოთ თავიდან."
      );
    },
  });
};
