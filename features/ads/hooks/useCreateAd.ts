import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adsService } from "../services/adsService";
import { CreateAdDto } from "../types";
import QUERY_KEYS from "@/lib/querykeys";
import { toast } from "sonner";

export const useCreateAd = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAdDto) => adsService.createAd.post(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADS.ALL });
      toast.success("Ad created successfully!");
    },
    onError: (error: unknown) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create ad. Please try again."
      );
    },
  });
};

