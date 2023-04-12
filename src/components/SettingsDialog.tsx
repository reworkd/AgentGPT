import React from "react";
import Button from "./Button";
import { FaKey } from "react-icons/fa";
import Dialog from "./Dialog";
import Input from "./Input";

export default function SettingsDialog({
  show,
  close,
  customApiKey,
  setCustomApiKey,
  maxLoops,
  setMaxLoops,
}: {
  show: boolean;
  close: () => void;
  customApiKey: string;
  setCustomApiKey: (key: string) => void;
  maxLoops: number;
  setMaxLoops: (loops: number) => void;
}) {
  const [apiKey, setApiKey] = React.useState<string>(customApiKey);
  const [loops, setLoops] = React.useState<number>(maxLoops);

  const handleClose = () => {
    setApiKey(apiKey);
    setLoops(maxLoops);
    close();
  };

  const handleSave = () => {
    setCustomApiKey(apiKey);
    setMaxLoops(maxLoops);
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
              <FaKey />
              <span className="ml-2">Key:</span>
            </>
          }
          placeholder={"sk-..."}
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <strong className="mt-10">
          NOTE: This must be a PAID OpenAI API account, not the free tier. This
          is different from a ChatGPT Plus subscription.
        </strong>
      </div>
      <div className="text-md relative flex-auto p-2 leading-relaxed">
        <p className="mb-3">
          You can also set the maximum number of loops your agent will run for.
          Setting this value to zero will disable the loop limit.
          <em>
            Disabling the loop limit is not recommended as it may cause your
            OpenAI account to incur unexpected charges.
          </em>{" "}
        </p>
        <Input
          left={
            <>
              <FaKey />
              <span className="ml-2">Max Loops:</span>
            </>
          }
          placeholder={"30"}
          value={loops.toString()}
          onChange={(e) => setLoops(Number(e.target.value))}
        />
      </div>
    </Dialog>
  );
}
