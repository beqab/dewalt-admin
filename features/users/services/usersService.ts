import { createApiClient } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import type { User } from "../types";

const usersClient = createApiClient(API_ROUTES.ADMIN_USERS);

export interface UsersListResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const usersService = {
  getUsers: {
    get: (params?: {
      page?: number;
      limit?: number;
      search?: string;
    }): Promise<UsersListResponse> => {
      const queryParams: Record<string, string | number> = {};
      if (params?.page) queryParams.page = params.page;
      if (params?.limit) queryParams.limit = params.limit;
      if (params?.search) queryParams.search = params.search;
      return usersClient.get<UsersListResponse>(
        Object.keys(queryParams).length > 0 ? queryParams : undefined,
      );
    },
  },
};

