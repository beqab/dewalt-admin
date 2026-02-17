import { useQuery } from "@tanstack/react-query";
import { finaService } from "../services/finaService";

export const useGetFinaProductsList = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["fina", "products", "list"],
    queryFn: () => finaService.getProductsList.get(),
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

