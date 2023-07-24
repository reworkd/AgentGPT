import clsx from "clsx";
import type { ReactNode } from "react";

import Badge from "../Badge";

const LinkItem = (props: {
  title: string;
  children: ReactNode;
  href?: string;
  badge?: { text: string; className?: string };
  onClick: () => void;
}) => (
  <li>
    <a
      href={props.href}
      className={clsx(
        "text-color-secondary hover:background-color-2 hover:text-color-primary cursor-pointer",
        "group flex gap-x-3 rounded-md px-2 py-1 text-sm leading-7"
      )}
      onClick={(e) => {
        e.preventDefault();
        props.onClick();
      }}
    >
      <span className="text-color-secondary group-hover:text-color-primary neutral-button-primary flex h-[2em] w-[2em] shrink-0 items-center justify-center rounded-lg border text-sm font-medium group-hover:scale-110">
        {props.children}
      </span>
      <span className="font-light">{props.title}</span>
      {props.badge && (
        <Badge className={clsx("ml-auto", props.badge.className)}>{props.badge.text}</Badge>
      )}
    </a>
  </li>
);

export default LinkItem;
