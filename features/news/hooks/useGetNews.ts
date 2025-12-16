import { useQuery } from "@tanstack/react-query";
import { newsService } from "../services/newsService";
import QUERY_KEYS from "@/lib/querykeys";
import { PaginatedNewsResponse } from "../types";

export const useGetNews = (page: number = 1, limit: number = 10) => {
  return useQuery<PaginatedNewsResponse>({
    queryKey: QUERY_KEYS.NEWS.list(page, limit),
    queryFn: () => newsService.getNews.get(page, limit),
  });
};
