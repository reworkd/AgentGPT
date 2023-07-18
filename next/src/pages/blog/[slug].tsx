import NavBar from "../../components/NavBar";
import { useRouter } from "next/router";
import { getPostData, getSortedPostsData } from "../../lib/posts";
import ReactMarkdown from "react-markdown";
import FadeIn from "../../components/motions/FadeIn";
import FooterLinks from "../../components/landing/FooterLinks";

export default function BlogPost({ postData }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div className="overflow-hidden">
      <NavBar />
      <FadeIn duration={3}>
        <div className="flex min-h-screen justify-center">
          <div className="bg-stars animate-stars"></div>
          <div className="flex h-full max-w-[1440px] flex-col justify-between">
            <main className="mx-auto px-6 lg:px-8">
              <div className="bg-transparent py-8 sm:py-16">
                <div className="mx-auto max-w-2xl text-center">
                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Reblogd
                  </h2>
                  <p className="mt-2 text-lg leading-8 text-white/60">
                    Learn exciting updates on Reworkd's Projects & Latest Developments in Tech.
                  </p>
                </div>
              </div>
            </main>
            <div className="mx-auto mb-8 max-w-2xl sm:mb-16">
              <div className="text-white">
                <h1>{postData.title}</h1>
                <p>{postData.date}</p>
                <ReactMarkdown>{postData.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
        <footer className="flex flex-col items-center justify-center gap-2 pb-2 sm:gap-4 sm:pb-4 lg:flex-row">
          <FooterLinks />
          <div className="font-inter text-xs font-normal text-gray-300 sm:text-sm lg:order-first">
            &copy; 2023 Reworkd AI, Inc.
          </div>
        </footer>
      </FadeIn>
    </div>
  );
}

export async function getStaticPaths() {
  // Fetch the list of blog post slugs or IDs dynamically
  const allPostsData = getSortedPostsData();

  // Generate the paths based on the slugs
  const paths = allPostsData.map(({ id }) => ({
    params: { slug: id },
  }));

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.slug);

  return {
    props: {
      postData,
    },
  };
}
