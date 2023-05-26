import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    accessToken?: string;
    user: DefaultSession["user"] & User;
  }

  interface User {
    id: string;
    image?: string;
  }
}
