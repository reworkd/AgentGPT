import clsx from "clsx";
import { SyntheticEvent } from "react";
import SourceLink from "./SourceLink";
import { api } from "../../utils/api";

interface MessageInfo {
  messageInfo: string;
}

const SourceCard = ({ messageInfo }: MessageInfo) => {
  const regex = /(?=\[(!\[.+?\]\(.+?\)|.+?)]\((https?:\/\/[^\)]+)\))/gi;
  const linksSet = new Set<string>();
  const linksMatches = [...messageInfo.matchAll(regex)];
  linksMatches.forEach((m) => linksSet.add(m[2] as string));
  const linksArray = Array.from(linksSet);

  if (linksArray.length === 0) return null;

  return (
    <>
      <hr className="my-2 border border-white/20" />
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4" >
        {linksArray.map((link, index) => {
          return <SourceLink key={link} link={link} index={index} />;
        })}
      </div>
    </>
  );
};

export default SourceCard;
