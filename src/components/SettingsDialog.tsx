import React from "react";
import Button from "./Button";
import { FaKey, FaMicrochip } from "react-icons/fa";
import Dialog from "./Dialog";
import Input from "./Input";
import Dropdown from "./Dropdown";
import { GPT_MODEL_NAMES } from "../utils/constants";

export default function SettingsDialog({
  show,
  close,
  customApiKey,
  setCustomApiKey,
  customModelName,
  setCustomModelName,
}: {
  show: boolean;
  close: () => void;
  customApiKey: string;
  setCustomApiKey: (key: string) => void;
  customModelName: string;
  setCustomModelName: (key: string) => void;
}) {
  const [key, setKey] = React.useState<string>(customApiKey);

  const handleClose = () => {
    setKey(customApiKey);
    close();
  };

  const handleSave = () => {
    setCustomApiKey(key);
    close();
  };

  return (
    <Dialog
      header="Settings ⚙"
      isShown={show}
      close={handleClose}
      footerButton={<Button onClick={handleSave}>Save</Button>}
    >
      <p>
        Here you can add your OpenAI API key. This will require you to pay for
        your own OpenAI usage but give you greater access to AgentGPT! You can
        additionally select any model OpenAI offers.
      </p>
      <br />
      <p>To use GPT-4, your API Key needs to have the correct access.</p>
      <br />
      <div className="text-md relative flex-auto p-2 leading-relaxed">
        <Input
          left={
            <>
              <FaMicrochip />
              <span className="ml-2">Model:</span>
            </>
          }
          type="combobox"
          value={customModelName}
          onChange={(e) => null}
          setValue={setCustomModelName}
          attributes={{ options: GPT_MODEL_NAMES }}
        />
        <br className="hidden md:inline" />
        <Input
          left={
            <>
              <FaKey />
              <span className="ml-2">Key: </span>
            </>
          }
          placeholder={"sk-..."}
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <strong className="mt-10">
          NOTE: To get a key, sign up for an OpenAI account and visit the
          following{" "}
          <a
            href="https://platform.openai.com/account/api-keys"
            className="text-blue-500"
          >
            link.
          </a>{" "}
          This key is only used in the current browser session
        </strong>
      </div>
    </Dialog>
  );
}
