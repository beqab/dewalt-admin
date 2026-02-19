import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bannerSliderService } from "../services/bannerSliderService";
import { BannerSliderResponse, ReorderBannersDto } from "../types";
import QUERY_KEYS from "@/lib/querykeys";
import { toast } from "sonner";

export const useReorderBanners = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ReorderBannersDto) =>
      bannerSliderService.reorderBanners.post(data),
    // Optimistic Update
    onMutate: async (newData: ReorderBannersDto) => {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.BANNER_SLIDER.ALL,
      });

      // Snapshot previous value
      const previousData = queryClient.getQueryData<BannerSliderResponse>(
        QUERY_KEYS.BANNER_SLIDER.ALL
      );

      // Optimistically update to new value
      queryClient.setQueryData(
        QUERY_KEYS.BANNER_SLIDER.ALL,
        (old: BannerSliderResponse) => {
          if (!old) return old;
          return {
            ...old,
            banners: newData.banners.map((banner, idx) => ({
              ...banner,
              order: idx,
            })),
          };
        }
      );

      return { previousData };
    },
    onError: (
      error: unknown,
      _variables,
      context?: { previousData?: BannerSliderResponse }
    ) => {
      // Rollback to previous value
      if (context?.previousData) {
        queryClient.setQueryData(
          QUERY_KEYS.BANNER_SLIDER.ALL,
          context.previousData
        );
      }
      toast.error(
        error instanceof Error
          ? error.message
          : "ბანერების გადალაგება ვერ მოხერხდა. გთხოვთ სცადოთ თავიდან."
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.BANNER_SLIDER.ALL,
      });
    },
    onSuccess: () => {
      toast.success("ბანერები წარმატებით გადალაგდა!");
    },
  });
};
