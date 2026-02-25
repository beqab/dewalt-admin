import { useMutation, useQueryClient } from "@tanstack/react-query";
import QUERY_KEYS from "@/lib/querykeys";
import { ordersService } from "../services/ordersService";
import { toast } from "sonner";
import type { ApiErrorResponse } from "@/lib/apiClient";

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: { orderId: string; status: string }) =>
      ordersService.updateStatus.post(vars.orderId, vars.status),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS.ALL });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ORDERS.BY_ID(vars.orderId),
      });
      toast.success("სტატუსი წარმატებით განახლდა!");
    },
    onError: (error: ApiErrorResponse) => {
      toast.error(error.message || "სტატუსის განახლება ვერ მოხერხდა.");
    },
  });
};

