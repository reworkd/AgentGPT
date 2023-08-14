import clsx from "clsx";
import type { PropsWithChildren } from "react";
import React, { memo } from "react";
import { HiEllipsisHorizontal } from "react-icons/hi2";
import type { HandleType, Position } from "reactflow";
import { Handle } from "reactflow";

import type { NodeBlockDefinition } from "../../../services/workflow/node-block-definitions";
import { useConfigStore } from "../../../stores/configStore";

interface Handle {
  position: Position;
  type: HandleType;
  className?: string;
  id?: string;
  text?: string;
}

interface NodeProps extends PropsWithChildren {
  handles: Handle[];
  selected: boolean;
  status?: string;
}

const AbstractNode = (props: NodeProps) => (
  <div
    className={clsx(
      "flex w-80 flex-col gap-4 rounded-xl bg-[#FBFCFD] p-3 shadow-xs transition-colors duration-300",
      props.status === "running" && "ring ring-amber-500/50",
      props.status === "success" && "ring ring-green-500/50",
      props.status === "error" && "ring ring-red-500/50"
    )}
  >
    {props.children}
    {props.handles.map(({ position, type, text, className, id }, i) => (
      <Handle
        key={`${i}-${id || ""}`}
        {...(id ? { id } : {})} /* Only specify id if provided */
        type={type}
        position={position}
        className={clsx(
          "border-gradient !hover:border-white z-10 grid !h-fit !w-fit place-items-center !rounded-md !border-2 !border-white !bg-black p-1 text-xs font-light shadow-xl",
          className
        )}
      >
        {text}
      </Handle>
    ))}
  </div>
);

export default memo(AbstractNode);

export const NodeTitle = ({ definition }: { definition?: NodeBlockDefinition }) => {
  const setLayout = useConfigStore().setLayout;
  if (!definition) return <></>;

  return (
    <>
      <div className="flex items-center gap-2">
        <definition.icon size={12} />
        <div className="flex-grow text-xs">{definition?.name}</div>
        <button
          className="rounded-full p-0.5 transition-colors hover:bg-gray-50"
          onClick={() => {
            setLayout({
              showRightSidebar: true,
            });
          }}
        >
          <HiEllipsisHorizontal size={12} />
        </button>
      </div>
      <div className="text-xs font-light text-[#687076]">{definition?.description}</div>
    </>
  );
};

// background: linear-gradient(180deg, #FA4D62 0%, #C21026 100%);
