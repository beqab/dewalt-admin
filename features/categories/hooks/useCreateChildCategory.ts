import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesService } from "../services/categoriesService";
import { CreateChildCategoryDto } from "../types";
import QUERY_KEYS from "@/lib/querykeys";
import { toast } from "sonner";

export const useCreateChildCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateChildCategoryDto) =>
      categoriesService.createChildCategory.post(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES.CHILD_CATEGORIES.ALL });
      const categoryId = typeof data.categoryId === "string" ? data.categoryId : data.categoryId._id;
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CATEGORIES.CHILD_CATEGORIES.BY_CATEGORY(categoryId),
      });
      toast.success("Child category created successfully!");
    },
    onError: (error: unknown) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create child category. Please try again."
      );
    },
  });
};

