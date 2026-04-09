import { useQuery } from "@tanstack/react-query";
import QUERY_KEYS from "@/lib/querykeys";
import { serviceCenterService } from "../services/serviceCenterService";
import type { ServiceCenter } from "../types";

export const useGetServiceCenter = () =>
  useQuery<ServiceCenter>({
    queryKey: QUERY_KEYS.SERVICE_CENTER.ONE,
    queryFn: () => serviceCenterService.get(),
  });
