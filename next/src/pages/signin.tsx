import clsx from "clsx";
import type { GetServerSidePropsContext } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { getServerSession } from "next-auth/next";
import type { BuiltInProviderType } from "next-auth/providers";
import type { ClientSafeProvider } from "next-auth/react";
import { getProviders, signIn, useSession } from "next-auth/react";
import type { LiteralUnion } from "next-auth/react/types";
import React, { useState } from "react";
import { FaDiscord, FaGithub, FaGoogle } from "react-icons/fa";

import FadeIn from "../components/motions/FadeIn";
import GridLayout from "../layout/grid";
import { authOptions } from "../server/auth/auth";
import Input from "../ui/input";

const SignIn = ({ providers }: { providers: Provider }) => {
  const { data: session } = useSession();
  const { push } = useRouter();

  if (session) push("/").catch(console.error);

  const details = Object.values(providers)
    .map((provider) => providerButtonDetails[provider.id])
    .filter((detail): detail is ButtonDetail => detail !== undefined);

  return (
    <GridLayout title="Sign in - Reworkd">
      <div className="grid h-screen w-screen place-items-center bg-gradient-radial from-slate-1 via-20% to-transparent">
        <div className="flex h-full w-full max-w-screen-lg flex-col items-center justify-center gap-10">
          <FadeIn
            duration={1.5}
            initialY={-50}
            className="flex flex-col items-center justify-center gap-6 text-white invert"
          >
            <div className="flex flex-col items-center justify-center gap-16">
              <Image
                src="/logos/dark-default-gradient.svg"
                width="150"
                height="150"
                alt="Reworkd AI"
              />
              <h1 className="bg-gradient-to-t from-white via-neutral-300 to-neutral-500 bg-clip-text text-center text-3xl font-bold leading-[1.1em] tracking-[-0.64px] text-transparent md:text-5xl">
                Reworkd
              </h1>
            </div>
          </FadeIn>
          <FadeIn duration={1.5} delay={0.4} initialY={50}>
            {providers.credentials && <InsecureSignin />}
            {details.map((detail) => (
              <ProviderSignInButton key={detail.id} detail={detail} />
            ))}
          </FadeIn>
        </div>
      </div>
    </GridLayout>
  );
};

const InsecureSignin = () => {
  const [usernameValue, setUsernameValue] = useState("");

  return (
    <div className="flex flex-col">
      <Input
        value={usernameValue}
        onChange={(e) => setUsernameValue(e.target.value)}
        placeholder="Enter Username"
        type="text"
        name="Username Field"
      />
      <button
        onClick={() => {
          if (!usernameValue) return;

          signIn("credentials", {
            callbackUrl: "/",
            name: usernameValue,
          }).catch(console.error);
        }}
        className={clsx(
          "mb-4 mt-4 flex items-center rounded-md bg-slate-12 px-10 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-slate-10 sm:text-base",
          !usernameValue && "cursor-not-allowed"
        )}
      >
        Sign in with username (Insecure)
      </button>
    </div>
  );
};

type Provider = Record<LiteralUnion<BuiltInProviderType>, ClientSafeProvider>;

interface ButtonDetail {
  id: string;
  icon: JSX.Element;
  color: string;
}

const providerButtonDetails: { [key: string]: ButtonDetail } = {
  google: {
    id: "google",
    icon: <FaGoogle className="mr-2" />,
    color: "bg-white hover:bg-gray-200 text-black",
  },
  discord: {
    id: "discord",
    icon: <FaDiscord className="mr-2" />,
    color: "bg-blue-600 hover:bg-blue-700 text-white",
  },
  github: {
    id: "github",
    icon: <FaGithub className="mr-2" />,
    color: "bg-gray-800 hover:bg-gray-900 text-white",
  },
};

const ProviderSignInButton = ({ detail }: { detail: ButtonDetail }) => {
  return (
    <button
      onClick={() => {
        signIn(detail.id, { callbackUrl: "/" }).catch(console.error);
      }}
      className={clsx(
        detail.color,
        "mb-4 flex w-full items-center rounded-md px-10 py-3 text-base font-semibold shadow-md transition-colors duration-300 sm:px-16 sm:py-5 sm:text-xl"
      )}
    >
      {detail.icon}
      Sign in with {detail.id}
    </button>
  );
};

export default SignIn;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  return {
    props: { providers: (await getProviders()) ?? {} },
  };
}
