import type { ForwardedRef } from "react";
import React, { forwardRef, useState } from "react";

import Loader from "../components/loader";
import Ping from "../components/Ping";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  loader?: boolean;
  disabled?: boolean;
  ping?: boolean;
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
    } finally {
      e.preventDefault();
    }
  };

  return (
    <button
      ref={ref}
      type={props.type}
      disabled={loading || props.disabled}
      className={props.className}
      onClick={onClick}
    >
      {props.ping && <Ping color="white" />}
      <div className="flex items-center justify-center gap-x-2.5 px-4 py-1 font-inter text-sm leading-6">
        {loading ? <Loader /> : props.children}
      </div>
    </button>
  );
});

Button.displayName = "Button";
export default Button;
