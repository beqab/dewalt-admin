import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesService } from "../services/categoriesService";
import { UpdateCategoryDto } from "../types";
import QUERY_KEYS from "@/lib/querykeys";
import { toast } from "sonner";

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryDto }) =>
      categoriesService.updateCategory.patch(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES.CATEGORIES.ALL });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CATEGORIES.CATEGORIES.BY_ID(variables.id),
      });
      toast.success("Category updated successfully!");
    },
    onError: (error: unknown) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update category. Please try again."
      );
    },
  });
};

