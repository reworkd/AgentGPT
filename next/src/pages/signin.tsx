import React from "react";
import clsx from "clsx";
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { FaDiscord, FaGithub, FaGoogle } from "react-icons/fa";
import { getProviders, signIn, useSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../server/auth/auth";

import FadeIn from "../components/motions/FadeIn";
import Image from "next/image";
import { useRouter } from "next/router";

const SignIn = ({ providers }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session } = useSession();
  const { push } = useRouter();

  if (session) {
    push("/").catch(console.error);
  }

  return (
    <>
      <Head>
        <title>Sign in - AgentGPT</title>
      </Head>

      <div
        className="h-screen w-screen"
        style={{
          backgroundColor: "rgb(0, 0, 0)",
          backgroundImage:
            "radial-gradient(at 170% 0%, rgb(49, 46, 129) 0, transparent 69%), radial-gradient(at 0% -30%, rgb(21, 94, 117) 0, transparent 50%)",
        }}
      >
        <div className="flex h-full w-full items-center justify-center pb-8">
          <FadeIn
            duration={1.5}
            delay={0}
            className="flex max-w-screen-lg flex-1 flex-col items-center justify-center text-white"
          >
            <div className="flex flex-row gap-6">
              <Image src="logo-white.svg" width="56" height="56" alt="Reworkd AI" />

              <h1
                className={`${clsx(
                  "bg-gradient-to-br from-white via-neutral-300 to-neutral-500 bg-clip-text text-transparent",
                  "text-center text-4xl font-bold leading-[1.1em] tracking-[-0.64px] sm:text-5xl"
                )}`}
              >
                Welcome to AgentGPT
              </h1>
            </div>
            {providers &&
              Object.values(providers).map((provider) => (
                <div key={provider.id}>
                  <SignInBtn provider={btnDetails[provider.id]} id={provider.id} />
                </div>
              ))}
          </FadeIn>
        </div>
      </div>
    </>
  );
};

const SignInBtn: React.FC<{
  provider: { name: string; icon: JSX.Element; color: string } | undefined;
  id: string;
}> = (props) => {
  const { provider, id } = props;
  return provider ? (
    <button
      onClick={() => {
        signIn(id, { callbackUrl: "/" }).catch(console.error);
      }}
      className={`${provider.color}  mb-4 flex items-center rounded-md px-10 py-3 text-base font-semibold shadow-md transition-colors duration-300 sm:px-16 sm:py-5 sm:text-xl`}
    >
      {provider.icon}
      Sign in with {provider.name}
    </button>
  ) : (
    <></>
  );
};

type BTNdetail = {
  [key: string]:
    | {
        name: string;
        icon: JSX.Element;
        color: string;
      }
    | undefined;
};
const btnDetails: BTNdetail = {
  google: {
    name: "Google",
    icon: <FaGoogle className="mr-2" />,
    color: "bg-white hover:bg-gray-200 text-black",
  },
  discord: {
    name: "Discord",
    icon: <FaDiscord className="mr-2" />,
    color: "bg-purple-700 hover:bg-purple-600 text-white",
  },
  github: {
    name: "Github",
    icon: <FaGithub className="mr-2" />,
    color: "bg-gray-900 hover:bg-gray-800 text-white",
  },
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
    props: { providers: providers ?? [] },
  };
}
