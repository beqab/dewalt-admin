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
      toast.success("Login successful!");
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
        setError("Please enter both email and password");
        return;
      }

      if (err instanceof Error && err.message === "INVALID_CREDENTIALS") {
        setError("Invalid credentials. Please try again.");
        toast.error("Login failed. Please check your credentials.");
        return;
      }

      setError("An unexpected error occurred. Please try again.");
      toast.error("Login failed. Please try again.");
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
