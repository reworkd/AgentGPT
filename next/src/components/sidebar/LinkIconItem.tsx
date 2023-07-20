import clsx from "clsx";
import type { ReactNode } from "react";

const LinkIconItem = (props: { children: ReactNode; href?: string; onClick: () => void }) => (
  <a
    href={props.href}
    className={clsx(
      "grid h-10 w-10 cursor-pointer place-items-center rounded-xl text-2xl",
      "neutral-button-primary border",
      "group group-hover:scale-110"
    )}
    onClick={(e) => {
      e.preventDefault();
      props.onClick();
    }}
  >
    {props.children}
  </a>
);

export default LinkIconItem;
