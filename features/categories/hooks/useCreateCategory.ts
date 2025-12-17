import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesService } from "../services/categoriesService";
import { CreateCategoryDto } from "../types";
import QUERY_KEYS from "@/lib/querykeys";
import { toast } from "sonner";

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCategoryDto) =>
      categoriesService.createCategory.post(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES.CATEGORIES.ALL });
      const brandId = typeof data.brandId === "string" ? data.brandId : data.brandId._id;
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CATEGORIES.CATEGORIES.BY_BRAND(brandId),
      });
      toast.success("Category created successfully!");
    },
    onError: (error: unknown) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create category. Please try again."
      );
    },
  });
};

