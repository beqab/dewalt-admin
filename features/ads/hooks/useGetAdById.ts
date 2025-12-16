import { useQuery } from "@tanstack/react-query";
import { adsService } from "../services/adsService";
import QUERY_KEYS from "@/lib/querykeys";
import { AdResponse } from "../types";

export const useGetAdById = (id: string, enabled: boolean = true) => {
  return useQuery<AdResponse>({
    queryKey: QUERY_KEYS.ADS.BY_ID(id),
    queryFn: () => adsService.getAdById.get(id),
    enabled: enabled && !!id,
  });
};

