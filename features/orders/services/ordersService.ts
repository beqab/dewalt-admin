import { createApiClient } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import type { Order, OrderDetailsResponse, OrdersListResponse } from "../types";

const ordersClient = createApiClient(API_ROUTES.ORDERS_ADMIN);

export const ordersService = {
  getOrders: {
    get: (params?: {
      page?: number;
      limit?: number;
      status?: string;
      uuid?: string;
      id?: string;
      email?: string;
    }): Promise<OrdersListResponse> => {
      const queryParams: Record<string, string | number> = {};
      if (params?.page) queryParams.page = params.page;
      if (params?.limit) queryParams.limit = params.limit;
      if (params?.status) queryParams.status = params.status;
      if (params?.uuid) queryParams.uuid = params.uuid;
      if (params?.id) queryParams.id = params.id;
      if (params?.email) queryParams.userEmail = params.email;

      return ordersClient.get<OrdersListResponse>(
        Object.keys(queryParams).length > 0 ? queryParams : undefined,
      );
    },
  },
  getOrderById: {
    get: (id: string): Promise<OrderDetailsResponse> =>
      ordersClient.get<OrderDetailsResponse>(undefined, id),
  },
  updateStatus: {
    post: (orderId: string, status: string): Promise<Order> =>
      ordersClient.post<{ orderId: string; status: string }, Order>(
        { orderId, status },
        undefined,
        { url: `${API_ROUTES.ORDERS_ADMIN}/status` },
      ),
  },
};

