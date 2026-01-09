import { useQuery } from "@tanstack/react-query";
import { productsService } from "../services/productsService";
import QUERY_KEYS from "@/lib/querykeys";
import type { ProductResponse } from "../types";

export const useGetProductById = (id: string) => {
  return useQuery<ProductResponse>({
    queryKey: QUERY_KEYS.PRODUCTS.BY_ID(id),
    queryFn: () => productsService.getProductById.get(id),
    enabled: !!id,
  });
};

