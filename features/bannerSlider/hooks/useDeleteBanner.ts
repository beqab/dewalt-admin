import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bannerSliderService } from "../services/bannerSliderService";
import QUERY_KEYS from "@/lib/querykeys";
import { toast } from "sonner";

export const useDeleteBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (order: number) =>
      bannerSliderService.deleteBanner.delete(order),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.BANNER_SLIDER.ALL,
      });
      toast.success("ბანერი წარმატებით წაიშალა!");
    },
    onError: (error: unknown) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "ბანერის წაშლა ვერ მოხერხდა. გთხოვთ სცადოთ თავიდან."
      );
    },
  });
};

