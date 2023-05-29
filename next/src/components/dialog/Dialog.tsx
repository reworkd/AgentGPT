import React from "react";
import Button from "../Button";

import { useTranslation } from "next-i18next";
import clsx from "clsx";

const Dialog = ({
  header,
  children,
  isShown,
  close,
  footerButton,
}: {
  header: React.ReactNode;
  children: React.ReactNode;
  isShown: boolean;
  close: () => void;
  footerButton?: React.ReactNode;
}) => {
  const [t] = useTranslation();

  return (
    <DialogBackground isShown={isShown} close={close}>
      <div className="relative mx-auto my-6 w-auto max-w-4xl rounded-lg border-2 border-zinc-600">
        {/*content*/}
        <div
          className="relative z-50 flex w-full flex-col rounded-lg border-0 bg-[#3a3a3a] shadow-lg outline-none focus:outline-none"
          onClick={(e) => e.stopPropagation()} // Avoid closing the modal
        >
          {/*header*/}
          <div className="flex items-start justify-between rounded-t border-b-2 border-solid border-white/20 p-5">
            <h3 className="font-mono text-3xl font-semibold">{header}</h3>
            <button className="float-right ml-auto border-0 bg-transparent p-1 text-3xl font-semibold leading-none opacity-5 outline-none focus:outline-none">
              <span className="block h-6 w-6 bg-transparent text-2xl opacity-5 outline-none focus:outline-none">
                ×
              </span>
            </button>
          </div>
          {/*body*/}
          <div
            className={clsx(
              "text-md relative max-h-[50vh] flex-auto overflow-y-auto p-5 leading-relaxed md:p-7"
            )}
          >
            {children}
          </div>
          {/*footer*/}
          <div className="flex items-center justify-end gap-2 rounded-b border-t-2 border-solid border-white/20 p-2">
            <Button enabledClassName="bg-yellow-600 hover:bg-yellow-500" onClick={close}>
              {`${t("CLOSE", { ns: "common" })}`}
            </Button>
            {footerButton}
          </div>
        </div>
      </div>
    </DialogBackground>
  );
};

export type DialogBackgroundProps = {
  isShown: boolean;
  children: React.ReactNode;
  close: () => void;
};

export const DialogBackground = ({ isShown, children, close }: DialogBackgroundProps) => {
  if (!isShown) {
    return <>{null}</>;
  }

  return (
    <div
      className={clsx(
        "fixed inset-0 z-40 flex items-center justify-center overflow-hidden",
        "bg-black/70 p-3 font-mono text-white outline-none backdrop-blur-sm transition-all"
      )}
      onClick={close}
    >
      <div className="relative max-h-full overflow-y-auto">{children}</div>
    </div>
  );
};
export default Dialog;
