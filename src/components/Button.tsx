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
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void> | void;
}

const Button = forwardRef(
  (props: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) => {
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
        className={
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          "transition-all hover:shadow-2xl " + props.className
        }
        onClick={onClick}
      >
        <div className="flex items-center">
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
  }
);

Button.displayName = "Button";
export default Button;
