import { useMutation, useQueryClient } from "@tanstack/react-query";
import { newsService } from "../services/newsService";
import { UpdateNewsDto } from "../types";
import QUERY_KEYS from "@/lib/querykeys";
import { toast } from "sonner";

export const useUpdateNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNewsDto }) =>
      newsService.updateNews.patch(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NEWS.list() });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NEWS.BY_ID(variables.id),
      });
      toast.success("სიახლე წარმატებით განახლდა!");
    },
    onError: (error: unknown) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "სიახლის განახლება ვერ მოხერხდა. გთხოვთ სცადოთ თავიდან."
      );
    },
  });
};

