import React, { useState } from "react";
import clsx from "clsx";
import type { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { FaDiscord, FaGithub, FaGoogle } from "react-icons/fa";
import type { ClientSafeProvider } from "next-auth/react";
import { getProviders, signIn, useSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../server/auth/auth";

import FadeIn from "../components/motions/FadeIn";
import Image from "next/image";
import { useRouter } from "next/router";
import Input from "../components/Input";
import type { LiteralUnion } from "next-auth/react/types";
import type { BuiltInProviderType } from "next-auth/providers";

const SignIn = ({ providers }: { providers: Provider }) => {
  const { data: session } = useSession();
  const { push } = useRouter();

  if (session) push("/").catch(console.error);

  const details = Object.values(providers)
    .map((provider) => providerButtonDetails[provider.id])
    .filter((detail): detail is ButtonDetail => detail !== undefined);

  return (
    <>
      <Head>
        <title>Sign in - AgentGPT</title>
      </Head>

      <div className="radial-background-1 grid h-screen w-screen place-items-center bg-black">
        <div className="flex h-full w-full max-w-screen-lg flex-col items-center justify-center gap-10">
          <FadeIn
            duration={1.5}
            initialY={-50}
            className="flex flex-col items-center justify-center gap-6 text-white"
          >
            <div className="flex flex-row gap-6">
              <Image src="logo-white.svg" width="56" height="56" alt="Reworkd AI" />
              <h1
                className={`${clsx(
                  "bg-gradient-to-br from-white via-neutral-300 to-neutral-500 bg-clip-text text-transparent",
                  "text-center text-3xl font-bold leading-[1.1em] tracking-[-0.64px] md:text-5xl"
                )}`}
              >
                <span className="hidden sm:flex">Welcome to AgentGPT</span>
                <span className="flex sm:hidden">AgentGPT</span>
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
    </>
  );
};

const InsecureSignin = () => {
  const [usernameValue, setUsernameValue] = useState("");
  return (
    <div>
      <Input
        value={usernameValue}
        onChange={(e) => setUsernameValue(e.target.value)}
        placeholder="Enter Username"
        type="text"
      />
      <button
        onClick={() => {
          if (!usernameValue) return;

          signIn("credentials", { callbackUrl: "/", name: usernameValue }).catch(console.error);
        }}
        className={clsx(
          "mb-4 mt-4 flex items-center rounded-md bg-white px-10 py-3 text-sm font-semibold text-black sm:text-base",
          "transition-colors duration-300 hover:bg-gray-200",
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
      className={`${detail.color} mb-4 flex items-center rounded-md px-10 py-3 text-base font-semibold shadow-md transition-colors duration-300 sm:px-16 sm:py-5 sm:text-xl`}
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

  const providers = await getProviders();
  return {
    props: { providers: providers ?? {} },
  };
}
