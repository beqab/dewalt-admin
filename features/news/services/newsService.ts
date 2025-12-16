import { createApiClient } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import {
  PaginatedNewsResponse,
  NewsResponse,
  CreateNewsDto,
  UpdateNewsDto,
} from "../types";

const newsClient = createApiClient<PaginatedNewsResponse | NewsResponse>(
  API_ROUTES.NEWS
);

export const newsService = {
  getNews: {
    get: (page: number = 1, limit: number = 10) => {
      return newsClient.get<PaginatedNewsResponse>({
        page: page.toString(),
        limit: limit.toString(),
      });
    },
  },
  getNewsById: {
    get: (id: string) => newsClient.get<NewsResponse>({}, id),
  },
  createNews: {
    post: (data: CreateNewsDto) =>
      newsClient.post<CreateNewsDto, NewsResponse>(data),
  },
  updateNews: {
    patch: (id: string, data: UpdateNewsDto) =>
      newsClient.patchById<UpdateNewsDto, NewsResponse>(id, data),
  },
  deleteNews: {
    delete: (id: string) => newsClient.delete(id),
  },
};
