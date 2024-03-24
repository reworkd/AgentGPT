import React from "react";
import { useRouter } from "next/router";

import AppHead from "../components/AppHead";
import FooterLinks from "../components/landing/FooterLinks";
import FadeIn from "../components/motions/FadeIn";
import NavBar from "../components/NavBar";
import { getSortedPostsData } from "../lib/posts";


export default function BlogPage({ allPostsData }) { 
  const router = useRouter();

  return (
    <div className="min-w-screen mx-6 grid min-h-screen place-items-center py-2 selection:bg-purple-700/25 lg:overflow-x-hidden lg:overflow-y-hidden">
      <AppHead title="Reworkd Blog" />

      <div className="flex h-full w-full max-w-[1440px] flex-col justify-between overflow-hidden">
        <NavBar />
        <FadeIn initialY={30} duration={3}>
          <div className="flex min-h-screen justify-center">
            <div className="bg-stars animate-stars"></div>

            <div className="flex h-full max-w-[1440px] flex-col justify-between">
              <main className="mx-auto px-6 lg:px-8">
                <div className="bg-transparent py-8 sm:py-16">
                  <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                      Reblogd
                    </h2>
                  </div>
                </div>
              </main>
              <div className="flex-grow overflow-y-auto">
                <div className="mx-auto mb-8 max-w-2xl cursor-pointer sm:mb-16">
                  {allPostsData.map(({ id, title, date, imageUrl, category, author }) => (
                    <article
                      key={id}
                      className="flex flex-col items-start justify-between rounded-lg p-3 transition-all duration-300 hover:bg-white/5"
                      onClick={() => {
                        router.push(`/blog/${id}`).catch(console.error);
                      }}
                    >
                      <div className="relative w-full">
                        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                        <img
                          src={imageUrl}
                          alt=""
                          className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                        />
                      </div>
                      <div className="max-w-xl">
                        <div className="mt-4 flex items-center gap-x-2 text-xs sm:mt-6 sm:text-sm">
                          <time dateTime={date} className="text-gray-300">
                            {date}
                          </time>
                          <p className="relative z-10 rounded-full bg-gray-300 px-2 py-0.5 font-medium text-gray-600">
                            {category.title}
                          </p>
                        </div>
                        <div className="group relative">
                          <h3 className="mt-2 text-lg font-semibold leading-6 text-white sm:mt-4">
                            <span className="absolute inset-0" />
                            {title}
                          </h3>
                        </div>
                        <div className="relative mb-10 mt-4 flex items-center gap-x-2 sm:mt-6">
                          <img
                            src={author.imageUrl}
                            alt=""
                            className="h-8 w-8 rounded-full bg-gray-100 sm:h-10 sm:w-10"
                          />
                          <div className="text-sm leading-6">
                            <div className="font-semibold text-white">
                              <p>
                                <span className="absolute inset-0" />
                                {author.name}
                              </p>
                            </div>
                            <p className="text-gray-300">{author.role}</p>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
              <footer className="flex flex-col items-center justify-center gap-2 pb-2 sm:gap-4 sm:pb-4 lg:flex-row">
                <FooterLinks />
                <div className="font-inter text-xs font-normal text-gray-300 sm:text-sm lg:order-first">
                  &copy; 2023 Reworkd AI, Inc.
                </div>
              </footer>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}
