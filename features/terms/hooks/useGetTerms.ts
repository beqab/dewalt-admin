import { useQuery } from "@tanstack/react-query";
import QUERY_KEYS from "@/lib/querykeys";
import { termsService } from "../services/termsService";
import type { Terms } from "../types";

export const useGetTerms = () =>
  useQuery<Terms>({
    queryKey: QUERY_KEYS.TERMS.ONE,
    queryFn: () => termsService.getTerms.get(),
  });
