import type { SyntheticEvent } from "react";

import { api } from "../../utils/api";
import FadeIn from "../motions/FadeIn";

interface LinkInfo {
  link: string;
  index: number;
}

const SourceLink = ({ link, index }: LinkInfo) => {
  const linkMeta = api.linkMeta.get.useQuery(link);
  const addImageFallback = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = "/errorFavicon.ico";
  };

  return (
    <FadeIn>
      <a href={link} target="_blank">
        <div className="group h-full space-y-2 rounded border border-white/20 bg-white/5 p-2 transition-colors duration-300 hover:bg-white/10">
          {linkMeta.isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-2 rounded bg-gray-500"></div>
              <div className="h-2 rounded bg-gray-500"></div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-gray-500"></div>
                <div className="h-2 w-2/3  rounded bg-gray-500"></div>
              </div>
            </div>
          ) : linkMeta.isSuccess ? (
            <>
              <p className="line-clamp-2 text-xs">{linkMeta.data.title}</p>
              <div className="flex gap-2">
                <img
                  className="inline h-4 w-4"
                  src={linkMeta.data.favicon || ""}
                  alt="Logo"
                  onError={addImageFallback}
                />
                <p className="line-clamp-1">{linkMeta.data.hostname}</p>
                <p className="rounded-full bg-white/20 px-1 text-gray-300 transition-colors duration-300 group-hover:bg-sky-600">
                  {index + 1}
                </p>
              </div>
            </>
          ) : linkMeta.isError ? (
            <div className="flex gap-2">
              <p className="line-clamp-1">{link}</p>
              <p className="rounded-full bg-white/20 px-1 text-gray-300">{index + 1}</p>
            </div>
          ) : null}
        </div>
      </a>
    </FadeIn>
  );
};

export default SourceLink;
