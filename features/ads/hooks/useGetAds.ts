import { useQuery } from "@tanstack/react-query";
import { adsService } from "../services/adsService";
import QUERY_KEYS from "@/lib/querykeys";
import { AdResponse } from "../types";

export const useGetAds = () => {
  return useQuery<AdResponse[]>({
    queryKey: QUERY_KEYS.ADS.ALL,
    queryFn: () => adsService.getAds.get(),
  });
};

