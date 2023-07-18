import { getSortedPostsData } from "../lib/posts";
import NavBar from "../components/NavBar";
import Link from "next/link";

export default function BlogPage({ allPostsData }) {
  return (
    <div>
      <NavBar />
      <h1>Blog</h1>
      <ul className="text-white">
        {allPostsData.map(({ id, title, date }) => (
          <li key={id}>
            <Link href="./blog/[slug]" as={`/blog/${id}`}>
              {title}
            </Link>
            <br />
            {date}
          </li>
        ))}
      </ul>
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
