import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      _id: string;
      accessToken: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    _id: string;
    token: string;
    tokenExpiresAt: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    _id: string;
    accessToken: string;
    expiresAt: number;
    tokenExpiresAt: string;
  }
}
