import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adsService } from "../services/adsService";
import { UpdateAdDto } from "../types";
import QUERY_KEYS from "@/lib/querykeys";
import { toast } from "sonner";

export const useUpdateAd = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAdDto }) =>
      adsService.updateAd.patch(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADS.ALL });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ADS.BY_ID(variables.id),
      });
      toast.success("Ad updated successfully!");
    },
    onError: (error: unknown) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update ad. Please try again."
      );
    },
  });
};

