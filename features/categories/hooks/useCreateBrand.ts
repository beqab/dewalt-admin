import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesService } from "../services/categoriesService";
import { CreateBrandDto } from "../types";
import QUERY_KEYS from "@/lib/querykeys";
import { toast } from "sonner";
import { ApiErrorResponse } from "@/lib/apiClient";

export const useCreateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBrandDto) =>
      categoriesService.createBrand.post(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CATEGORIES.BRANDS.ALL,
      });
      toast.success("Brand created successfully!");
    },
    onError: (error: ApiErrorResponse) => {
      toast.error(error.message || "Failed to create brand. Please try again.");
    },
  });
};
