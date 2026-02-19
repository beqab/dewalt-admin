import { useMutation, useQueryClient } from "@tanstack/react-query";
import { newsService } from "../services/newsService";
import { CreateNewsDto } from "../types";
import QUERY_KEYS from "@/lib/querykeys";
import { toast } from "sonner";

export const useCreateNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateNewsDto) => newsService.createNews.post(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NEWS.list() });
      toast.success("სიახლე წარმატებით შეიქმნა!");
    },
    onError: (error: unknown) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "სიახლის შექმნა ვერ მოხერხდა. გთხოვთ სცადოთ თავიდან."
      );
    },
  });
};
