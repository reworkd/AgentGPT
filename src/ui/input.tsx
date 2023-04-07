import type {
  Dispatch,
  ForwardedRef,
  InputHTMLAttributes,
  KeyboardEventHandler,
  SetStateAction,
} from "react";
import { forwardRef } from "react";

const SHARED_STYLE = "rounded-full ";
const STYLE =
  SHARED_STYLE +
  " border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 ";
const ERROR_STYLE =
  SHARED_STYLE + " border-red-500 focus:border-red-500 focus:ring-red-500 ";

export interface InputProps<T> extends InputHTMLAttributes<HTMLInputElement> {
  model: [T, Dispatch<SetStateAction<T>>];
  error?: [boolean, Dispatch<SetStateAction<boolean>>];
  enterPressed?: () => void;
}

const Input = forwardRef(
  (props: InputProps<string>, ref: ForwardedRef<HTMLInputElement>) => {
    const { model, error, enterPressed, onKeyDown, className, ...otherProps } =
      props;
    const [isError, setIsError] = error || [false, () => undefined];

    const keyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
      try {
        if (e.key === "Enter" && enterPressed) {
          e.preventDefault();
          enterPressed();
          return;
        }

        if (onKeyDown) onKeyDown(e);
      } catch (e) {
        setIsError(true);
      }
    };

    return (
      <input
        ref={ref}
        onKeyDown={keyDown}
        value={model[0]}
        onChange={(e) => {
          model[1](e.target.value);
          setIsError(false);
        }}
        /* eslint-disable-next-line @typescript-eslint/restrict-plus-operands */
        className={(isError ? ERROR_STYLE : STYLE) + className}
        {...otherProps}
      />
    );
  }
);

Input.displayName = "input";
export default Input;
