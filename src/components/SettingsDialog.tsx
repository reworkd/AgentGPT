import React from "react";
import Button from "./Button";
import { FaKey, FaMicrochip } from "react-icons/fa";
import Dialog from "./Dialog";
import Input from "./Input";

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
      <div className="text-md relative flex-auto p-2 leading-relaxed">
        <p className="mb-3">
          Welcome to AgentGPT! We&apos;re receiving traffic far higher than our
          small team is able to provide for at the moment.
        </p>
        <p className="mb-3">
          Because of this, we momentarily ask that users utilize their own
          OpenAI API key for AgentGPT.{" "}
          <em>
            This will only be used in the current browser session and not stored
            anywhere.
          </em>{" "}
          If you elect not to, your agent will not be able to execute for very
          long. To do this, sign up for an OpenAI account and visit the
          following{" "}
          <a
            href="https://platform.openai.com/account/api-keys"
            className="text-blue-500"
          >
            link.
          </a>
        </p>
        <Input
          left={
            <>
              <FaMicrochip />
              <span className="ml-2">Model:</span>
            </>
          }
          placeholder={"gpt-3.5-turbo"}
          value={customModelName}
          onChange={(e) => setCustomModelName(e.target.value)}
        />
        <br />
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
          NOTE: This must be a PAID OpenAI API account, not the free tier. This
          is different from a ChatGPT Plus subscription.
        </strong>
      </div>
    </Dialog>
  );
}
