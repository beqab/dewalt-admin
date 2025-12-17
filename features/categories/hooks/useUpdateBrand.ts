import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesService } from "../services/categoriesService";
import { UpdateBrandDto } from "../types";
import QUERY_KEYS from "@/lib/querykeys";
import { toast } from "sonner";

export const useUpdateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBrandDto }) =>
      categoriesService.updateBrand.patch(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES.BRANDS.ALL });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CATEGORIES.BRANDS.BY_ID(variables.id),
      });
      toast.success("Brand updated successfully!");
    },
    onError: (error: unknown) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update brand. Please try again."
      );
    },
  });
};

