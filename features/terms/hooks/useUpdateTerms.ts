import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import QUERY_KEYS from "@/lib/querykeys";
import { termsService } from "../services/termsService";
import type { UpdateTermsDto } from "../types";

export const useUpdateTerms = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTermsDto) => termsService.updateTerms.patch(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TERMS.ONE });
      toast.success("ტერმსები წარმატებით განახლდა!");
    },
    onError: (error: unknown) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "ტერმსების განახლება ვერ მოხერხდა. სცადეთ თავიდან."
      );
    },
  });
};
