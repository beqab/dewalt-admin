import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productsService } from "../services/productsService";
import { UpdateProductDto } from "../types";
import QUERY_KEYS from "@/lib/querykeys";
import { toast } from "sonner";
import type { ApiErrorResponse } from "@/lib/apiClient";

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductDto }) =>
      productsService.updateProduct.post(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PRODUCTS.ALL,
      });
      toast.success("Product updated successfully!");
    },
    onError: (error: ApiErrorResponse) => {
      toast.error(
        error.message || "Failed to update product. Please try again."
      );
    },
  });
};
