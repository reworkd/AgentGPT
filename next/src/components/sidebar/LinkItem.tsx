import type { ReactNode } from "react";
import clsx from "clsx";

const LinkItem = (props: {
  title: string;
  icon: ReactNode;
  href?: string;
  onClick: () => void;
}) => (
  <li>
    <a
      href={props.href}
      className={clsx(
        "text-color-secondary hover:background-color-1 hover:text-color-primary cursor-pointer",
        "group flex gap-x-3 rounded-md px-2 py-1 text-sm font-semibold leading-6"
      )}
      onClick={(e) => {
        e.preventDefault();
        props.onClick();
      }}
    >
      <span className="background-color-1 text-color-secondary group-hover:text-color-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-shade-300-light text-[0.7rem] font-medium group-hover:scale-110 dark:border-shade-200-dark">
        {props.icon}
      </span>
      <span className="truncate">{props.title}</span>
    </a>
  </li>
);

export default LinkItem;
