import React, { useEffect } from "react";
import Button from "./Button";
import {
  FaKey,
  FaMicrochip,
  FaThermometerFull,
  FaExclamationCircle,
  FaSyncAlt,
  FaCoins,
  FaTachometerAlt,
} from "react-icons/fa";
import Dialog from "./Dialog";
import Input from "./Input";
import { GPT_MODEL_NAMES, GPT_4 } from "../utils/constants";
import Accordion from "./Accordion";
import type { ModelSettings, SettingModel } from "../utils/types";
import LanguageCombobox from "./LanguageCombobox";
import clsx from "clsx";
import { useTypeSafeTranslation } from "../hooks/useTypeSafeTranslation";
import { AUTOMATIC_MODE, PAUSE_MODE } from "../types/agentTypes";
import { useAgentStore } from "../components/stores";

export const SettingsDialog: React.FC<{
  show: boolean;
  close: () => void;
  customSettings: SettingModel;
}> = ({ show, close, customSettings }) => {
  const [settings, setSettings] = React.useState<ModelSettings>({
    ...customSettings.settings,
  });
  const t = useTypeSafeTranslation();
  const agent = useAgentStore.use.agent();
  const agentMode = useAgentStore.use.agentMode();
  const updateAgentMode = useAgentStore.use.updateAgentMode();

  useEffect(() => {
    setSettings(customSettings.settings);
  }, [customSettings, close]);

  const updateSettings = <Key extends keyof ModelSettings>(
    key: Key,
    value: ModelSettings[Key]
  ) => {
    setSettings((prev) => {
      return { ...prev, [key]: value };
    });
  };

  function keyIsValid(key: string | undefined) {
    const pattern = /^sk-[a-zA-Z0-9]{48}$/;
    return key && pattern.test(key);
  }

  const handleSave = () => {
    if (!keyIsValid(settings.customApiKey)) {
      alert(
        t(
          "Key is invalid, please ensure that you have set up billing in your OpenAI account!"
        )
      );
      return;
    }

    customSettings.saveSettings(settings);
    close();
    return;
  };

  const handleReset = () => {
    customSettings.resetSettings();
    close();
  };

  const disabled = !settings.customApiKey;
  const advancedSettings = (
    <div className="flex flex-col gap-2">
      <Input
        left={
          <>
            <FaThermometerFull />
            <span className="ml-2">Temp: </span>
          </>
        }
        value={settings.customTemperature}
        onChange={(e) =>
          updateSettings("customTemperature", parseFloat(e.target.value))
        }
        type="range"
        toolTipProperties={{
          message: t(
            "Higher values will make the output more random, while lower values make the output more focused and deterministic."
          ),
          disabled: false,
        }}
        attributes={{
          min: 0,
          max: 1,
          step: 0.01,
        }}
      />
      <Input
        left={
          <>
            <FaSyncAlt />
            <span className="ml-2">Loop #: </span>
          </>
        }
        value={settings.customMaxLoops}
        disabled={disabled}
        onChange={(e) =>
          updateSettings("customMaxLoops", parseFloat(e.target.value))
        }
        type="range"
        toolTipProperties={{
          message: t(
            "Controls the maximum number of loops that the agent will run (higher value will make more API calls)."
          ),
          disabled: false,
        }}
        attributes={{
          min: 1,
          max: 100,
          step: 1,
        }}
      />
      <Input
        left={
          <>
            <FaCoins />
            <span className="ml-2">Tokens: </span>
          </>
        }
        value={settings.maxTokens ?? 400}
        disabled={disabled}
        onChange={(e) =>
          updateSettings("maxTokens", parseFloat(e.target.value))
        }
        type="range"
        toolTipProperties={{
          message:
            "Controls the maximum number of tokens used in each API call (higher value will make responses more detailed but cost more).",
          disabled: false,
        }}
        attributes={{
          min: 200,
          max: 2000,
          step: 100,
        }}
      />
    </div>
  );

  return (
    <Dialog
      header={t("Settings ⚙")}
      isShown={show}
      close={close}
      footerButton={
        <>
          <Button className="bg-red-400 hover:bg-red-500" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </>
      }
      contentClassName="text-md relative flex flex-col gap-2 p-2 leading-relaxed"
    >
      <p>
        Get your own OpenAI API key{" "}
        <a className="link" href="https://platform.openai.com/account/api-keys">
          here
        </a>
        . Ensure you have free credits available on your account, otherwise you{" "}
        <a
          className="link"
          href="https://platform.openai.com/account/billing/overview"
        >
          must connect a credit card
        </a>
        .
      </p>
      {settings.customModelName === GPT_4 && (
        <p
          className={clsx(
            "my-2",
            "rounded-md border-[2px] border-white/10 bg-yellow-300 text-black"
          )}
        >
          <FaExclamationCircle className="inline-block" />
          &nbsp;
          <b>
            {t(
              "To use the GPT-4 model, you need to also provide the API key for GPT-4. You can request for it"
            )}
            &nbsp;
            <a
              href="https://openai.com/waitlist/gpt-4-api"
              className="text-blue-500"
            >
              {t("here")}
            </a>
            .&nbsp; {t("(ChatGPT Plus subscription will not work)")}
          </b>
        </p>
      )}
      <Input
        left={
          <>
            <FaKey />
            <span className="ml-2">Key: </span>
          </>
        }
        placeholder={"sk-..."}
        type="password"
        value={settings.customApiKey}
        onChange={(e) => updateSettings("customApiKey", e.target.value)}
      />
      <LanguageCombobox />
      <Input
        left={
          <>
            <FaMicrochip />
            <span className="ml-2">Model:</span>
          </>
        }
        type="combobox"
        value={settings.customModelName}
        onChange={() => null}
        setValue={(e) => updateSettings("customModelName", e)}
        attributes={{ options: GPT_MODEL_NAMES }}
        disabled={disabled}
      />
      <Input
        left={
          <>
            <FaTachometerAlt />
            <span className="ml-2">Mode: </span>
          </>
        }
        value={agentMode}
        disabled={agent !== null}
        onChange={() => null}
        setValue={updateAgentMode as (agentMode: string) => void}
        type="combobox"
        toolTipProperties={{
          message: `${AUTOMATIC_MODE} (Default): Agent automatically executes every task. \n\n${PAUSE_MODE}: Agent pauses after every set of task(s)`,
          disabled: false,
        }}
        attributes={{ options: [AUTOMATIC_MODE, PAUSE_MODE] }}
      />
      <Accordion child={advancedSettings} name={t("Advanced Settings")} />
    </Dialog>
  );
};
