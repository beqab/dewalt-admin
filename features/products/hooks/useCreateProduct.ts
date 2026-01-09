import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productsService } from "../services/productsService";
import { CreateProductDto } from "../types";
import QUERY_KEYS from "@/lib/querykeys";
import { toast } from "sonner";
import type { ApiErrorResponse } from "@/lib/apiClient";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProductDto) =>
      productsService.createProduct.post(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PRODUCTS.ALL,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PRODUCTS.LIST(),
      });
      toast.success("Product created successfully!");
    },
    onError: (error: ApiErrorResponse) => {
      toast.error(
        error.message || "Failed to create product. Please try again."
      );
    },
  });
};

