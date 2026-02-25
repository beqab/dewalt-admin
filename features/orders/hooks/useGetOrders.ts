import { useQuery } from "@tanstack/react-query";
import QUERY_KEYS from "@/lib/querykeys";
import { ordersService } from "../services/ordersService";
import type { OrdersListResponse } from "../types";

export const useGetOrders = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  uuid?: string;
  id?: string;
  email?: string;
}) => {
  return useQuery<OrdersListResponse>({
    queryKey: QUERY_KEYS.ORDERS.LIST(params?.page, params?.limit, {
      status: params?.status,
      uuid: params?.uuid,
      id: params?.id,
      email: params?.email,
    }),
    queryFn: () => ordersService.getOrders.get(params),
  });
};

