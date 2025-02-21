// src/types/next-auth.d.ts (Corrected)
import { DefaultSession, DefaultUser } from "next-auth" // Removed unused NextAuth import

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