import { createApiClient } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { AdResponse, CreateAdDto, UpdateAdDto } from "../types";

const adsClient = createApiClient<AdResponse | AdResponse[]>(API_ROUTES.ADS);

export const adsService = {
  getAds: {
    get: () => adsClient.get<AdResponse[]>(),
  },
  getAdById: {
    get: (id: string) => adsClient.get<AdResponse>({}, id),
  },
  getAdByPosition: {
    get: (position: string) =>
      adsClient.get<AdResponse>(
        { position },
        "by-position"
      ),
  },
  createAd: {
    post: (data: CreateAdDto) =>
      adsClient.post<CreateAdDto, AdResponse>(data),
  },
  updateAd: {
    patch: (id: string, data: UpdateAdDto) =>
      adsClient.patchById<UpdateAdDto, AdResponse>(id, data),
  },
  deleteAd: {
    delete: (id: string) => adsClient.delete(id),
  },
};

