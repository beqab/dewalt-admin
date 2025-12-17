import { useQuery } from "@tanstack/react-query";
import { categoriesService } from "../services/categoriesService";
import QUERY_KEYS from "@/lib/querykeys";
import { BrandResponse } from "../types";

export const useGetBrandById = (id: string, enabled: boolean = true) => {
  return useQuery<BrandResponse>({
    queryKey: QUERY_KEYS.CATEGORIES.BRANDS.BY_ID(id),
    queryFn: () => categoriesService.getBrandById.get(id),
    enabled: enabled && !!id,
  });
};

