import { useMutation } from "@tanstack/react-query";
import { finaService } from "../services/finaService";

export const useGetFinaProductsRestArray = () => {
  return useMutation({
    mutationFn: (prods: number[]) => finaService.getProductsRestArray.post(prods),
  });
};

