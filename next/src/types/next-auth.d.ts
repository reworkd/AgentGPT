import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    accessToken?: string;
    user: {
      id: string;
    } & DefaultSession["user"] &
      User;
  }

  interface User {
    image?: string;
    superAdmin: boolean;
    organizations: {
      id: string;
      name: string;
      role: string;
    }[];
  }
}
