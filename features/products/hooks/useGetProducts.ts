import { useQuery } from "@tanstack/react-query";
import {
  productsService,
  ProductsListResponse,
} from "../services/productsService";
import QUERY_KEYS from "@/lib/querykeys";

export const useGetProducts = (params?: {
  page?: number;
  limit?: number;
  brandId?: string;
  categoryId?: string;
  childCategoryId?: string;
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: string;
}) => {
  return useQuery<ProductsListResponse>({
    queryKey: QUERY_KEYS.PRODUCTS.LIST(params?.page, params?.limit, {
      brandId: params?.brandId,
      categoryId: params?.categoryId,
      childCategoryId: params?.childCategoryId,
      search: params?.search,
      inStock: params?.inStock,
      minPrice: params?.minPrice,
      maxPrice: params?.maxPrice,
      sort: params?.sort,
    }),
    queryFn: () => productsService.getProducts.get(params),
  });
};
