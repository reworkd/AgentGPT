import type { PropsWithChildren } from "react";

import AppHead from "../components/AppHead";

interface Props extends PropsWithChildren {
  title: string;
}

export default function GridLayout(props: Props) {
  return (
    <div
      className="bg-slate-1"
      style={{
        backgroundSize: "80px 80px",
        backgroundImage:
          "linear-gradient(to right, #F1F3F5 2px, transparent 2px), linear-gradient(to bottom, #F1F3F5 1px, transparent 1px)",
      }}
    >
      <AppHead title={props.title} />
      {props.children}
    </div>
  );
}
