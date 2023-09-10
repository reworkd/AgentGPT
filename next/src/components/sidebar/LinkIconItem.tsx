import type { ReactNode } from "react";

const LinkIconItem = (props: { children: ReactNode; href?: string; onClick: () => void }) => (
  <a
    href={props.href}
    className="group grid h-10 w-10 cursor-pointer place-items-center rounded-xl text-2xl group-hover:scale-110 group-hover:bg-slate-12"
    onClick={(e) => {
      e.preventDefault();
      props.onClick();
    }}
  >
    {props.children}
  </a>
);

export default LinkIconItem;
