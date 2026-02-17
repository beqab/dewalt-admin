import { createApiClient } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import type {
  FinaProductListItem,
  FinaProductsRestArrayResponse,
} from "../types";

const finaClient = createApiClient(API_ROUTES.FINA);

export const finaService = {
  getProductsList: {
    get: (): Promise<FinaProductListItem[]> =>
      finaClient.get<FinaProductListItem[]>({}, "products/list"),
  },
  getProductsRestArray: {
    post: (prods: number[]): Promise<FinaProductsRestArrayResponse> =>
      finaClient.post<{ prods: number[] }, FinaProductsRestArrayResponse>(
        { prods },
        undefined,
        { url: `${API_ROUTES.FINA}/products/rest-array` }
      ),
  },
};

