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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PRODUCTS.ALL,
      });
      toast.success("პროდუქტი წარმატებით განახლდა!");
    },
    onError: (error: ApiErrorResponse) => {
      toast.error(
        error.message || "პროდუქტის განახლება ვერ მოხერხდა. გთხოვთ სცადოთ თავიდან."
      );
    },
  });
};
