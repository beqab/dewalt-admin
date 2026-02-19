import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

type LoginVars = {
  email: string;
  password: string;
};

export const useLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: LoginVars) => {
      if (!email || !password) {
        throw new Error("MISSING_FIELDS");
      }

      const result = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error("INVALID_CREDENTIALS");
      }

      if (!result?.ok) {
        throw new Error("LOGIN_FAILED");
      }

      return result;
    },
    onSuccess: () => {
      toast.success("წარმატებით შეხვედით!");
      const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
      console.log("callbackUrl", callbackUrl);
      if (callbackUrl === "/") {
        router.push("/dashboard");
      } else {
        router.push(callbackUrl);
      }
    },
    onError: (err: unknown) => {
      if (err instanceof Error && err.message === "MISSING_FIELDS") {
        setError("გთხოვთ შეიყვანოთ ელ.ფოსტა და პაროლი");
        return;
      }

      if (err instanceof Error && err.message === "INVALID_CREDENTIALS") {
        setError("არასწორი მონაცემები. გთხოვთ სცადოთ თავიდან.");
        toast.error("შესვლა ვერ მოხერხდა. გთხოვთ შეამოწმოთ მონაცემები.");
        return;
      }

      setError("მოულოდნელი შეცდომა მოხდა. გთხოვთ სცადოთ თავიდან.");
      toast.error("შესვლა ვერ მოხერხდა. გთხოვთ სცადოთ თავიდან.");
    },
  });

  const login = (vars: LoginVars) => {
    setError(null);
    loginMutation.mutate(vars);
  };

  return {
    login,
    error,
    isLoading: loginMutation.isPending,
    clearError: () => setError(null),
  };
};

export default useLogin;
