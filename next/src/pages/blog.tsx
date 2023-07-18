import { getSortedPostsData } from "../lib/posts";

export default function BlogPage({ allPostsData }) {
  return (
    <div>
      <h1>Blog</h1>
      <ul>
        {allPostsData.map(({ id, title, date }) => (
          <li key={id}>
            {title}
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
