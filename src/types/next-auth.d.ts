// src/types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string; // Add the id property
    } & DefaultSession["user"];
  }
    interface User extends DefaultUser {
        id: string;
  }
}
declare module "next-auth/jwt" {
    interface JWT {
        userId: string;
    }
}