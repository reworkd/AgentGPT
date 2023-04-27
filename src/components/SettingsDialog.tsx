import React, { useEffect } from "react";
import { useTranslation } from "next-i18next";
import Button from "./Button";
import {
  FaKey,
  FaMicrochip,
  FaThermometerFull,
  FaExclamationCircle,
  FaSyncAlt,
  FaCoins,
} from "react-icons/fa";
import Dialog from "./Dialog";
import Input from "./Input";
import { GPT_MODEL_NAMES, GPT_4 } from "../utils/constants";
import Accordion from "./Accordion";
import type { ModelSettings, SettingModel } from "../utils/types";
import LanguageCombobox from "./LanguageCombobox";
import clsx from "clsx";
import { useTypeSafeTranslation } from "../hooks/useTypeSafeTranslation";

export const SettingsDialog: React.FC<{
  show: boolean;
  close: () => void;
  customSettings: SettingModel;
}> = ({ show, close, customSettings }) => {
  const [settings, setSettings] = React.useState<ModelSettings>({
    ...customSettings.settings,
  });
  const t = useTypeSafeTranslation();

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
    updateSettings("customApiKey", "");
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
        {t(
          "Here you can add your OpenAI API key. This will require you to pay for your own OpenAI usage but give you greater access to AgentGPT! You can additionally select any model OpenAI offers."
        )}
      </p>
      <p
        className={clsx(
          "my-2",
          settings.customModelName === GPT_4 &&
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
      <Accordion child={advancedSettings} name={t("Advanced Settings")} />
      <strong className="mt-4">
        {t(
          "NOTE: To get a key, sign up for an OpenAI account and visit the following"
        )}{" "}
        <a
          href="https://platform.openai.com/account/api-keys"
          className="text-blue-500"
        >
          {t("link")}.
        </a>{" "}
        {t("This key is only used in the current browser session")}
      </strong>
    </Dialog>
  );
};
