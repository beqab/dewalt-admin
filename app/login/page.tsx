import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import LoginPage from "@/features/auth/loginPage";

export default async function Login() {
  const session = await auth();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <Suspense fallback={null}>
      <LoginPage />
    </Suspense>
  );
}
