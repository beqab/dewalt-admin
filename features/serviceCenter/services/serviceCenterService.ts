import { axiosInstance, createApiClient } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import type { ServiceCenter, UpdateServiceCenterDto } from "../types";

const client = createApiClient<ServiceCenter>(API_ROUTES.SERVICE_CENTER);

export const serviceCenterService = {
  get: (): Promise<ServiceCenter> => client.get<ServiceCenter>(),
  patch: async (data: UpdateServiceCenterDto): Promise<ServiceCenter> => {
    const res = await axiosInstance.patch<ServiceCenter>(
      API_ROUTES.SERVICE_CENTER,
      data
    );
    return res.data;
  },
};
