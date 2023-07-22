import type { Session } from "next-auth";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

type Provider = "google" | "github" | "discord";

interface Auth {
  signIn: (provider?: Provider) => Promise<void>;
  signOut: () => Promise<void>;
  status: "authenticated" | "unauthenticated" | "loading";
  session: Session | null;
}

export function useAuth({ protectedRoute } = { protectedRoute: false }): Auth {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (protectedRoute && status === "unauthenticated") {
      handleSignIn().catch(console.error);
    }
  }, [protectedRoute, status]);

  const handleSignIn = async () => {
    await signIn();
  };

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/",
    }).catch();
  };

  return {
    signIn: handleSignIn,
    signOut: handleSignOut,
    status,
    session,
  };
}
