import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bannerSliderService } from "../services/bannerSliderService";
import { CreateBannerDto } from "../types";
import QUERY_KEYS from "@/lib/querykeys";
import { toast } from "sonner";

export const useCreateBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBannerDto) =>
      bannerSliderService.createBanner.post(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.BANNER_SLIDER.ALL,
      });
      toast.success("ბანერი წარმატებით დაემატა!");
    },
    onError: (error: unknown) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "ბანერის დამატება ვერ მოხერხდა. გთხოვთ სცადოთ თავიდან."
      );
    },
  });
};
