import React from "react";
import NavBar from "../components/NavBar";
import FooterLinks from "../components/landing/FooterLinks";

interface Post {
  id: number;
  title: string;
  href: string;
  description: string;
  imageUrl: string;
  date: string;
  datetime: string;
  category: {
    title: string;
    href: string;
  };
  author: {
    name: string;
    role: string;
    href: string;
    imageUrl: string;
  };
}

const posts: Post[] = [
  {
    id: 1,
    title: "Boost your conversion rate",
    href: "#",
    description:
      "Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.",
    imageUrl:
      "https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3603&q=80",
    date: "Mar 16, 2020",
    datetime: "2020-03-16",
    category: { title: "Marketing", href: "#" },
    author: {
      name: "Michael Foster",
      role: "Co-Founder / CTO",
      href: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    id: 2,
    title: "Improve your website performance",
    href: "#",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed feugiat eget justo sed euismod. Suspendisse id nunc nec neque commodo consectetur. Nam rhoncus malesuada sagittis.",
    imageUrl:
      "https://images.unsplash.com/photo-1557683316-e10201644e2b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3600&q=80",
    date: "May 25, 2021",
    datetime: "2021-05-25",
    category: { title: "Web Development", href: "#" },
    author: {
      name: "Jessica Thompson",
      role: "Lead Developer",
      href: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1547658712-52b7da6c3eb7?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    id: 3,
    title: "Master the art of social media marketing",
    href: "#",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed feugiat eget justo sed euismod. Suspendisse id nunc nec neque commodo consectetur. Nam rhoncus malesuada sagittis.",
    imageUrl:
      "https://images.unsplash.com/photo-1581091201117-8c7a6811e9c1?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3600&q=80",
    date: "Oct 12, 2021",
    datetime: "2021-10-12",
    category: { title: "Social Media", href: "#" },
    author: {
      name: "Emily Collins",
      role: "Social Media Manager",
      href: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1579791844743-5f43b31c3223?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
];

const BlogPage: React.FC = () => {
  return (
    <div className="overflow-hidden">
      <NavBar />
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
          <div className="flex-grow overflow-y-auto">
            <div className="mx-auto mb-8 max-w-2xl sm:mb-16">
              {posts.map((post) => (
                <article key={post.id} className="flex flex-col items-start justify-between">
                  <div className="relative w-full">
                    <img
                      src={post.imageUrl}
                      alt=""
                      className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                    />
                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                  </div>
                  <div className="max-w-xl">
                    <div className="mt-4 flex items-center gap-x-2 text-xs sm:mt-6 sm:text-sm">
                      <time dateTime={post.datetime} className="text-gray-300">
                        {post.date}
                      </time>
                      <a
                        href={post.category.href}
                        className="relative z-10 rounded-full bg-gray-300 px-2 py-0.5 font-medium text-gray-600 hover:bg-gray-400"
                      >
                        {post.category.title}
                      </a>
                    </div>
                    <div className="group relative">
                      <h3 className="mt-2 text-lg font-semibold leading-6 text-white group-hover:text-gray-400 sm:mt-4">
                        <a href={post.href}>
                          <span className="absolute inset-0" />
                          {post.title}
                        </a>
                      </h3>
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-300 sm:mt-3">
                        {post.description}
                      </p>
                    </div>
                    <div className="relative mb-10 mt-4 flex items-center gap-x-2 sm:mt-6">
                      <img
                        src={post.author.imageUrl}
                        alt=""
                        className="h-8 w-8 rounded-full bg-gray-100 sm:h-10 sm:w-10"
                      />
                      <div className="text-sm leading-6">
                        <p className="font-semibold text-white">
                          <a href={post.author.href}>
                            <span className="absolute inset-0" />
                            {post.author.name}
                          </a>
                        </p>
                        <p className="text-gray-300">{post.author.role}</p>
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
    </div>
  );
};

export default BlogPage;
