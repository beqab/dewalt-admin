import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adsService } from "../services/adsService";
import QUERY_KEYS from "@/lib/querykeys";
import { toast } from "sonner";

export const useDeleteAd = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adsService.deleteAd.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADS.ALL });
      toast.success("Ad deleted successfully!");
    },
    onError: (error: unknown) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete ad. Please try again."
      );
    },
  });
};

