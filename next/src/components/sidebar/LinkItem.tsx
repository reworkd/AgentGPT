import clsx from "clsx";
import type { ReactNode } from "react";

const LinkItem = (props: {
  title: string;
  children: ReactNode;
  forceRefresh?: boolean;
  href?: string;
  onClick: () => void;
}) => (
  <li>
    <a
      href={props.href || ""}
      className={clsx(
        "group flex gap-x-3 rounded-md px-2 py-1 text-sm font-medium leading-7 text-slate-12 hover:bg-slate-5",
        !props.href && "cursor-not-allowed"
      )}
      onClick={(e) => {
        e.preventDefault();
        props.onClick();
      }}
    >
      <span className="flex items-center justify-center">{props.children}</span>
      <span>{props.title}</span>
    </a>
  </li>
);

export default LinkItem;
