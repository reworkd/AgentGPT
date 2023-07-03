import type { ReactNode } from "react";
import clsx from "clsx";

const LinkItem = (props: { icon: ReactNode; href?: string; onClick: () => void }) => (
  <a
    href={props.href}
    className={clsx(
      "grid h-11 w-11 cursor-pointer place-items-center rounded-xl text-2xl",
      "neutral-button-primary border",
      "group group-hover:scale-110"
    )}
    onClick={(e) => {
      e.preventDefault();
      props.onClick();
    }}
  >
    <span className="group-hover:scale-125">{props.icon}</span>
  </a>
);

export default LinkItem;
