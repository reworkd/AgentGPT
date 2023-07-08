import React, { useState, Fragment } from "react";
import clsx from "clsx";
import { useRouter } from "next/router";
import { useAgentInputStore } from "../../stores/agentInputStore";

type DialogBoxProps = {
  name: string;
  promptTemplate: string;
  category: string;
  icon: JSX.Element;
  onClose: () => void;
  placeholder: string;
};

const DialogBox = ({
  name,
  promptTemplate,
  category,
  icon,
  onClose,
  placeholder,
}: DialogBoxProps) => {
  const [inputValue, setInputValue] = useState("");

  const router = useRouter();
  const setNameInput = useAgentInputStore.use.setNameInput();
  const setGoalInput = useAgentInputStore.use.setGoalInput();

  const handleSubmit = () => {
    setNameInput(name);
    setGoalInput(promptTemplate.replace(placeholder, inputValue));

    router.push("/").catch(console.log);
  };

  const handleCancel = () => {
    setInputValue(placeholder);
    onClose();
  };

  const highlightPlaceholder = (prompt: string, placeholder: string) => {
    const parts = prompt.split(placeholder);
    return (
      <p className={`text-sm text-white`}>
        {parts.map((part, index) => (
          <Fragment key={index}>
            {part}
            {index !== parts.length - 1 && (
              <span className=" rounded-lg bg-blue-200 p-1 text-black">{placeholder}</span>
            )}
          </Fragment>
        ))}
      </p>
    );
  };

  return (
    <div
      className={clsx(
        "h-34 w-full max-w-lg cursor-pointer space-y-2 whitespace-normal rounded-2xl border border-white/20 p-4 text-left transition-all duration-100",
        "bg-zinc-900 transition-colors hover:bg-zinc-800"
      )}
    >
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
      {highlightPlaceholder(promptTemplate, placeholder)}
      <input
        type="text"
        className={clsx(
          "mt-2 w-full flex-grow rounded-md border border-white/10 bg-zinc-900 py-1 text-white placeholder-white shadow-sm focus:border-white focus:outline-none focus:ring-white",
          "placeholder-zinc-600"
        )}
        placeholder={placeholder}
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
            "border-2 border-white/10",
            "hover:bg-zinc-900",
            "rounded px-4 py-2 text-white focus:outline-none"
          )}
          onClick={handleSubmit}
        >
          Deploy
        </button>
      </div>
    </div>
  );
};

export default DialogBox;
