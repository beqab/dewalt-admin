import { useQuery } from "@tanstack/react-query";
import { newsService } from "../services/newsService";
import QUERY_KEYS from "@/lib/querykeys";
import { NewsResponse } from "../types";

export const useGetNewsById = (id: string, enabled: boolean = true) => {
  return useQuery<NewsResponse>({
    queryKey: QUERY_KEYS.NEWS.BY_ID(id),
    queryFn: () => newsService.getNewsById.get(id),
    enabled: enabled && !!id,
  });
};
