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
    id: 4,
    title: "Asim S",
    href: "#",
    description:
      "Asim is a visionary leader with expertise in marketing strategies and business development. He specializes in leveraging the power of digital marketing to drive growth and brand recognition. Asim is passionate about staying ahead of the curve in the ever-evolving marketing landscape.",
    imageUrl:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    date: "Jan 10, 2023",
    datetime: "2023-01-10",
    category: { title: "Marketing", href: "#" },
    author: {
      name: "Asim Patel",
      role: "CEO / Founder",
      href: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    id: 5,
    title: "Adam W",
    href: "#",
    description:
      "Adam is a seasoned technologist with a deep understanding of cutting-edge technologies. He leads the technical team and drives innovation in the development of high-performance web applications. Adam is passionate about leveraging technology to solve complex problems and deliver exceptional user experiences.",
    imageUrl:
      "https://images.unsplash.com/photo-1557683316-e10201644e2b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3600&q=80",
    date: "Feb 20, 2023",
    datetime: "2023-02-20",
    category: { title: "Tech", href: "#" },
    author: {
      name: "Adam Johnson",
      role: "CTO / Co-Founder",
      href: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1557683316-e10201644e2b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3600&q=80",
    },
  },
  {
    id: 6,
    title: "Srijan S",
    href: "#",
    description:
      "Srijan is a strategic thinker and operations expert. As the COO, he ensures smooth business operations and efficient execution of projects. Srijan excels at streamlining processes, optimizing resources, and fostering collaboration across teams. His strong leadership skills drive organizational success.",
    imageUrl:
      "https://images.unsplash.com/photo-1581091201117-8c7a6811e9c1?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3600&q=80",
    date: "Mar 15, 2023",
    datetime: "2023-03-15",
    category: { title: "Operations", href: "#" },
    author: {
      name: "Srijan Gupta",
      role: "COO / Co-Founder",
      href: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1581091201117-8c7a6811e9c1?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    id: 7,
    title: "Joe - Software Developer",
    href: "#",
    description:
      "Joe is a skilled software developer with a passion for building innovative solutions. He specializes in developing robust and scalable applications using the latest technologies. Jasan loves tackling complex coding challenges and is dedicated to delivering high-quality software products.",
    imageUrl:
      "https://images.unsplash.com/photo-1494905998402-395d579af36f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    date: "Apr 5, 2023",
    datetime: "2023-04-05",
    category: { title: "Tech", href: "#" },
    author: {
      name: "Joe G",
      role: "Software Developer",
      href: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1494905998402-395d579af36f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    id: 8,
    title: "Jasan - Software Developer",
    href: "#",
    description:
      "Jasn is a passionate software developer with expertise in building cutting-edge applications. He loves exploring new technologies and enjoys working on projects that involve artificial intelligence and machine learning. Joe is dedicated to creating software solutions that make a positive impact.",
    imageUrl:
      "https://images.unsplash.com/photo-1560807707-9aa6ce70a7cb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    date: "May 10, 2023",
    datetime: "2023-05-10",
    category: { title: "Tech", href: "#" },
    author: {
      name: "Jasn Smith",
      role: "Software Developer",
      href: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1560807707-9aa6ce70a7cb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
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
