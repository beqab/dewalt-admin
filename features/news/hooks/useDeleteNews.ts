import { useMutation, useQueryClient } from "@tanstack/react-query";
import { newsService } from "../services/newsService";
import QUERY_KEYS from "@/lib/querykeys";
import { toast } from "sonner";

export const useDeleteNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => newsService.deleteNews.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NEWS.list() });
      toast.success("სიახლე წარმატებით წაიშალა!");
    },
    onError: (error: unknown) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "სიახლის წაშლა ვერ მოხერხდა. გთხოვთ სცადოთ თავიდან."
      );
    },
  });
};
