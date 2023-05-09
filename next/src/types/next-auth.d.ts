import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"] &
      User;
  }

  interface User {
    role?: string;
    subscriptionId: string | undefined;
    image?: string;
  }
}
