import { useQuery } from "@tanstack/react-query";
import QUERY_KEYS from "@/lib/querykeys";
import { usersService } from "../services/usersService";
import type { UsersListResponse } from "../services/usersService";

export const useGetUsers = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return useQuery<UsersListResponse>({
    queryKey: QUERY_KEYS.USERS.LIST(params?.page, params?.limit, params?.search),
    queryFn: () => usersService.getUsers.get(params),
  });
};

