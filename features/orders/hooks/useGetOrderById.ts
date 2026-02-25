import { useQuery } from "@tanstack/react-query";
import QUERY_KEYS from "@/lib/querykeys";
import { ordersService } from "../services/ordersService";
import type { OrderDetailsResponse } from "../types";

export const useGetOrderById = (id?: string) => {
  return useQuery<OrderDetailsResponse>({
    queryKey: id ? QUERY_KEYS.ORDERS.BY_ID(id) : ["orders", "byId", "none"],
    queryFn: () => {
      if (!id) throw new Error("Order id is required");
      return ordersService.getOrderById.get(id);
    },
    enabled: Boolean(id),
  });
};

