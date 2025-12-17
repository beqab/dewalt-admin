import { useQuery } from "@tanstack/react-query";
import { categoriesService } from "../services/categoriesService";
import QUERY_KEYS from "@/lib/querykeys";
import { BrandResponse } from "../types";

export const useGetBrands = () => {
  return useQuery<BrandResponse[]>({
    queryKey: QUERY_KEYS.CATEGORIES.BRANDS.ALL,
    queryFn: () => categoriesService.getBrands.get(),
  });
};

