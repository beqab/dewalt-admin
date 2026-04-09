import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import QUERY_KEYS from "@/lib/querykeys";
import { serviceCenterService } from "../services/serviceCenterService";
import type { UpdateServiceCenterDto } from "../types";

export const useUpdateServiceCenter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateServiceCenterDto) =>
      serviceCenterService.patch(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SERVICE_CENTER.ONE,
      });
      toast.success("სერვის ცენტრი წარმატებით განახლდა!");
    },
    onError: (error: unknown) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "განახლება ვერ მოხერხდა. სცადეთ თავიდან."
      );
    },
  });
};
