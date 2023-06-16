import React, { useState, useEffect, useRef } from "react";
import clsx from "clsx";

type DialogBoxProps = {
  name: string;
  promptTemplate: string;
  category: string;
  onClose: () => void;
};
const DialogBox = ({ name, promptTemplate, category, onClose }: DialogBoxProps) => {
    const [inputValue, setInputValue] = useState("");
  
    const handleSubmit = () => {
      console.log("Input value:", inputValue);
      onClose();
    };
  
    const handleCancel = () => {
      setInputValue(""); // Reset the input value
      onClose();
    };
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-all duration-300 ease-in-out">
      <div className="p-4 border border-gray-200 rounded shadow-lg transform bg-black sm:max-w-xs lg:max-w-80 w-full">
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="mr-2 text-xl text-white">{name}</div>
          </div>
          <div
            className={clsx(
              `mb-2 inline-block rounded-full text-xs text-gray-400 bg-${category.toLowerCase()}-500`
            )}
          >
            {name}
          </div>
          <div className={`text-sm text-gray-200`}>{promptTemplate}</div>
          <input
            type="text"
            className={clsx(
              "w-full px-3 py-2 text-black placeholder-gray-500 border border-gray-300 rounded-md",
              "focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            )}
            placeholder="Enter your variable"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <div className="flex justify-end space-x-2">
            <button
              className={clsx(
                "px-4 py-2 text-white rounded focus:outline-none",
                "transition-colors hover:bg-red-600 focus:ring-2 focus:ring-red-500"
              )}
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className={clsx(
                "px-4 py-2 text-white rounded focus:outline-none",
                "transition-colors bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-green-500"
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
