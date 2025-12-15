import { createApiClient } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import {
  BannerSliderResponse,
  CreateBannerDto,
  UpdateBannerDto,
  ReorderBannersDto,
} from "../types";

const bannerSliderClient = createApiClient<BannerSliderResponse>(
  API_ROUTES.BANNER_SLIDER
);

const reorderBannersClient = createApiClient<BannerSliderResponse>(
  API_ROUTES.BANNER_SLIDER_REORDER
);

export const bannerSliderService = {
  getBannerSlider: {
    get: () => bannerSliderClient.get<BannerSliderResponse>(),
  },
  createBanner: {
    post: (data: CreateBannerDto) =>
      bannerSliderClient.post<CreateBannerDto, BannerSliderResponse>(data),
  },

  updateBanner: {
    patch: (order: number, data: UpdateBannerDto) =>
      bannerSliderClient.patchById<UpdateBannerDto, BannerSliderResponse>(
        order,
        data
      ),
  },
  deleteBanner: {
    delete: (order: number) => bannerSliderClient.delete(order),
  },
  reorderBanners: {
    post: (data: ReorderBannersDto) =>
      reorderBannersClient.post<ReorderBannersDto, BannerSliderResponse>(data),
  },
};
