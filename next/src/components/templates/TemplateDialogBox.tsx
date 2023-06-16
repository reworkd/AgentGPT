import React, { useState } from "react";
import clsx from "clsx";

type DialogBoxProps = {
  name: string;
  promptTemplate: string;
  category: string;
  icon: JSX.Element;
  onClose: () => void;
};

const DialogBox = ({ name, promptTemplate, category, icon, onClose }: DialogBoxProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = () => {
    console.log("Input value:", inputValue);
    onClose();
  };

  const handleCancel = () => {
    setInputValue("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-all duration-300 ease-in-out">
      <div className="lg:max-w-80 w-full transform rounded border border-gray-200 bg-zinc-900 p-4 shadow-lg sm:max-w-xs">
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="mr-2 text-xl text-white">{icon}</div>
            <div className="text-xl text-white">{name}</div>
          </div>
          <div
            className={clsx(
              `mb-2 inline-block rounded-full text-xs text-gray-400 bg-${category.toLowerCase()}-500`
            )}
          >
            {category}
          </div>
          <div className={`text-sm text-gray-200`}>{promptTemplate}</div>
          <input
            type="text"
            className={clsx(
              "w-full rounded-md border border-gray-300 px-3 py-2 text-black placeholder-gray-500",
              "focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-600"
            )}
            placeholder="Enter your variable"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <div className="flex justify-end space-x-2">
            <button
              className={clsx(
                "rounded px-4 py-2 text-white focus:outline-none",
                "transition-colors hover:bg-red-600 focus:ring-2 focus:ring-red-500"
              )}
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className={clsx(
                "rounded px-4 py-2 text-white focus:outline-none",
                "bg-green-500 transition-colors hover:bg-green-600 focus:ring-2 focus:ring-green-500"
              )}
              onClick={handleSubmit}
            >
              Deploy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DialogBox;
