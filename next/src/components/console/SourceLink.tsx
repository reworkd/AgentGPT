import clsx from "clsx";
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
      <a href="link">
        <div
          className="h-full space-y-2 rounded border border-white/20 bg-white/5 p-2"
        >
          {linkMeta.isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className={clsx("h-2 rounded bg-gray-500")}></div>
              <div className={clsx("h-2 rounded bg-gray-500")}></div>
              <div className={clsx("flex items-center gap-2")}>
                <div className={clsx("h-4 w-4 rounded bg-gray-500")}></div>
                <div className={clsx("h-2 w-2/3  rounded bg-gray-500")}></div>
              </div>
            </div>
          ) : linkMeta.isSuccess ? (
            <>
              <p className={clsx("line-clamp-2 text-xs")}>
                {linkMeta.data.title}
              </p>
              <div className={clsx("flex gap-2")}>
                <img
                  className={clsx("inline h-4 w-4")}
                  src={linkMeta.data.favicon || ""}
                  alt="Logo"
                  onError={addImageFallback}
                />
                <p className={clsx("line-clamp-1")}>{linkMeta.data.hostname}</p>
                <p
                  className={clsx(
                    "rounded-full bg-white/20 px-1 text-gray-300"
                  )}
                >
                  {index + 1}
                </p>
              </div>
            </>
          ) : linkMeta.isError ? (
            <div className={clsx("flex gap-2")}>
              <p className={clsx("line-clamp-1")}>{link}</p>
              <p
                className={clsx("rounded-full bg-white/20 px-1 text-gray-300")}
              >
                {index + 1}
              </p>
            </div>
          ) : null}
        </div>
      </a>
    </FadeIn>
  );
};

export default SourceLink;
