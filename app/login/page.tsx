"use client";

import { Suspense } from "react";
import LoginPage from "@/features/auth/loginPage";

export default function Login() {
  return (
    <Suspense fallback={null}>
      <LoginPage />
    </Suspense>
  );
}
