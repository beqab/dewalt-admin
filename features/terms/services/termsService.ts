import { axiosInstance, createApiClient } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import type { Terms, UpdateTermsDto } from "../types";

const termsClient = createApiClient<Terms>(API_ROUTES.TERMS);

export const termsService = {
  getTerms: {
    get: (): Promise<Terms> => termsClient.get<Terms>(),
  },
  updateTerms: {
    patch: async (data: UpdateTermsDto): Promise<Terms> => {
      const res = await axiosInstance.patch<Terms>(API_ROUTES.TERMS, data);
      return res.data;
    },
  },
};
