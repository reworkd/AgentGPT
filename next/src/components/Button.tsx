import clsx from "clsx";
import type { ForwardedRef } from "react";
import React, { forwardRef, useState } from "react";

import Loader from "./loader";

export interface ButtonProps {
  type?: "button" | "submit" | "reset";
  className?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  loader?: boolean;
  disabled?: boolean;
  ping?: boolean;
  enabledClassName?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void> | void;
}

const Button = forwardRef((props: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) => {
  const [loading, setLoading] = useState(false);
  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (props.loader == true) setLoading(true);

    try {
      void Promise.resolve(props.onClick?.(e)).then();
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <button
      ref={ref}
      type={props.type}
      disabled={loading || props.disabled}
      className={clsx(
        "text-gray/50 relative rounded-lg px-4 py-1 font-bold transition-all sm:px-10 sm:py-3",
        props.disabled && "cursor-not-allowed border-white/10 bg-slate-9 text-white",
        props.disabled ||
          "mou cursor-pointer bg-[#1E88E5]/70 text-white/80 hover:border-white/80 hover:bg-[#0084f7] hover:text-white hover:shadow-xl",
        props.disabled || props.enabledClassName,
        props.className
      )}
      onClick={onClick}
    >
      <div className="relative">
        {loading && (
          <Loader className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform" />
        )}
        <div
          className={clsx("flex h-full w-full items-center justify-center", loading && "opacity-0")}
        >
          {props.icon ? <div className="mr-2">{props.icon}</div> : null}
          {props.children}
        </div>
      </div>
    </button>
  );
});

Button.displayName = "Button";
export default Button;
