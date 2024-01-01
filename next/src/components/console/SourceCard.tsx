import SourceLink from "./SourceLink";

const SourceCard = ({ content }: { content: string }) => {
  const regex = /(?=\[(!\[.+?\]\(.+?\)|.+?)]\((https?:\/\/[^\)]+)\))/gi;
  const linksSet = new Set<string>();
  const linksMatches = [...content.matchAll(regex)];
  linksMatches.forEach((m) => linksSet.add(m[2] as string));
  const linksArray = Array.from(linksSet);

  if (linksArray.length === 0) return null;

  return (
    <>
      <div className="my-2 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {linksArray.map((link, index) => {
          return <SourceLink key={link} link={link} index={index} />;
        })}
      </div>
    </>
  );
};

export default SourceCard;
