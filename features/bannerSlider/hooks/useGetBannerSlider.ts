import { useQuery } from "@tanstack/react-query";
import QUERY_KEYS from "@/lib/querykeys";
import { bannerSliderService } from "../services/bannerSliderService";

export const useGetBannerSlider = () => {
  const queryResult = useQuery({
    queryKey: QUERY_KEYS.BANNER_SLIDER.ALL,
    queryFn: () => bannerSliderService.getBannerSlider.get(),
  });

  return queryResult;
};

