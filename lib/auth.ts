import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { ZodError } from "zod";
import { signInSchema } from "./zod";
import { createApiClient } from "./apiClient";
import { API_ROUTES } from "./apiRoutes";

import { cookies } from "next/headers";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "user@example.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        try {
          console.log("🔐 Authorize called with credentials:", {
            email: credentials?.email,
            password: credentials?.password ? "***" : "missing",
          });

          // Validate credentials using Zod
          const { email, password } = await signInSchema.parseAsync(
            credentials
          );

          console.log("✅ Credentials validated successfully");

          // Call your authentication service
          const response = await createApiClient(API_ROUTES.LOGIN).post<{
            token: string;
            refreshToken: string;
            tokenExpiresAt: Date;
            admin: {
              _id: string;
              username: string;
            };
          }>({
            username: email,
            password: password,
          });

          console.log("📡 API Response:", response ? "Success" : "No response");

          if (response) {
            const cookieStore = await cookies();
            cookieStore.set("refresh_token", response.refreshToken, {
              httpOnly: true, // Cannot be accessed by JavaScript
              secure: process.env.NODE_ENV === "production", // HTTPS only in production
              sameSite: "lax", // CSRF protection
              maxAge: 60 * 60 * 24 * 7, // 7 days
              path: "/",
            });

            const user = {
              id: response.admin._id,
              email: response.admin.username,
              name: response.admin.username,
              tokenExpiresAt: new Date(response.tokenExpiresAt).toISOString(),
              _id: response.admin._id,
              token: response.token,
            };
            console.log("👤 User object created:", {
              ...user,
              token: "***",
            });
            return user;
          }

          console.log("❌ No response from API");
          return null;
        } catch (error) {
          if (error instanceof ZodError) {
            console.error("❌ Validation error:", error);
            return null;
          }

          console.error("❌ Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log("user", user);
        console.log("token+++++++", token);
        const jwtToken = {
          ...token,
          accessToken: user.token,
          tokenExpiresAt: user.tokenExpiresAt,
          _id: user._id,
          email: user.email,
          name: user.name,
          expiresAt: new Date(user.tokenExpiresAt).getTime(),
        };
        return jwtToken;
      }

      // Ensure token has required properties before checking expiration
      if (!token.tokenExpiresAt || !token._id || !token.accessToken) {
        return token;
      }

      console.log(
        "token before refresh check",
        token,
        new Date(token.tokenExpiresAt).getTime()
      );

      // Check if access token is expired
      if (Date.now() > new Date(token.tokenExpiresAt).getTime()) {
        try {
          const cookieStore = await cookies();
          const refreshToken = cookieStore.get("refresh_token")?.value;

          if (!refreshToken) {
            console.error("❌ No refresh token found in cookie");
            return null;
          }

          const response = await createApiClient(
            API_ROUTES.REFRESH_TOKEN
          ).post<{
            token: string;
            message: string;
            refreshToken: string;
            tokenExpiresAt: Date;
            admin: {
              _id: string;
              username: string;
              facilityId: string | null;
            };
          }>({
            refreshToken: refreshToken,
          });

          cookieStore.set("refresh_token", response.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
          });
          console.log("🔄 response from refresh token", response);

          const refreshedToken = {
            ...token,
            accessToken: response.token,
            tokenExpiresAt: new Date(response.tokenExpiresAt).toISOString(),
            expiresAt: new Date(response.tokenExpiresAt).getTime(),
          };
          return refreshedToken;
        } catch (error) {
          console.error("❌ Refresh token error:", error);
          // SECURITY: Clear the refresh token cookie on error
          const cookieStore = await cookies();
          cookieStore.delete("refresh_token");
          return null;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.accessToken = token.accessToken;
        session.user._id = token._id;
        session.user.id = token._id;
        // Ensure email/name are set if available in token
        if (token.email) {
          session.user.email = token.email as string;
        }
        if (token.name) {
          session.user.name = token.name as string;
        }
      }
      return session;
    },
  },
  events: {
    // Clear refresh token cookie on signout
    async signOut() {
      const cookieStore = await cookies();
      cookieStore.delete("refresh_token");
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    updateAge: 10 * 60 * 1000, // 10 minutes
  },
  secret: process.env.NEXTAUTH_SECRET,
});
