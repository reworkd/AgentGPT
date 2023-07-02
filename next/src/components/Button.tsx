import type { ForwardedRef } from "react";
import React, { forwardRef, useState } from "react";
import Loader from "./loader";
import clsx from "clsx";
import Ping from "./Ping";

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
        "text-color-primary border-color-3 relative rounded-lg border-2 px-4 py-1 font-bold transition-all sm:px-10 sm:py-3",
        props.disabled && "button-disabled",
        props.disabled || "mou cursor-pointer",
        props.disabled || props.enabledClassName || "blue-button-primary",
        props.className
      )}
      onClick={onClick}
    >
      {props.ping ? <Ping color="white" /> : <></>}
      <div className="flex items-center justify-center">
        {loading ? (
          <Loader />
        ) : (
          <>
            {props.icon ? <div className="mr-2">{props.icon}</div> : null}
            {props.children}
          </>
        )}
      </div>
    </button>
  );
});

Button.displayName = "Button";
export default Button;
