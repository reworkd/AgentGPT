import cx from "classnames";
import type { ReactNode } from "react";

interface ChatWindowProps {
  children?: ReactNode;
}

const ChatWindow = ({ children }: ChatWindowProps) => {
  return (
    <div className="border-translucent flex h-80 w-full max-w-screen-md flex-col rounded-3xl bg-black/50 text-white drop-shadow-lg">
      <MacWindowHeader />
      {children}
    </div>
  );
};

const MacWindowHeader = () => {
  return (
    <div
      className={cx("flex gap-1 rounded-t-3xl p-3", "flex gap-1 rounded-t-3xl")}
    >
      <div className="h-3 w-3 rounded-full bg-red-500"></div>
      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
      <div className="h-3 w-3 rounded-full bg-green-500"></div>
    </div>
  );
};

export default ChatWindow;
