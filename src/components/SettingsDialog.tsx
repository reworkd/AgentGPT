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
import { AUTOMATIC_MODE, PAUSE_MODE } from "../types/agentTypes";
import { useAgentStore } from "./stores";
import { useTranslation } from "next-i18next";

export const SettingsDialog: React.FC<{
  show: boolean;
  close: () => void;
  customSettings: SettingModel;
}> = ({ show, close, customSettings }) => {
  const [settings, setSettings] = React.useState<ModelSettings>({
    ...customSettings.settings,
  });
  const [t] = useTranslation();
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
        `${t("INVALID_OPENAI_API_KEY", {
          ns: "settings",
        })}`
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
            <span className="ml-2">
              {`${t("TEMPERATURE", { ns: "settings" })}`}
            </span>
          </>
        }
        value={settings.customTemperature}
        onChange={(e) =>
          updateSettings("customTemperature", parseFloat(e.target.value))
        }
        type="range"
        toolTipProperties={{
          message: `${t("HIGHER_VALUES_MAKE_OUTPUT_MORE_RANDOM", {
            ns: "settings",
          })}`,
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
            <span className="ml-2">{`${t("LOOP", { ns: "settings" })}`}</span>
          </>
        }
        value={settings.customMaxLoops}
        disabled={disabled}
        onChange={(e) =>
          updateSettings("customMaxLoops", parseFloat(e.target.value))
        }
        type="range"
        toolTipProperties={{
          message: `${t("CONTROL_THE_MAXIMUM_NUM_OF_LOOPS", {
            ns: "settings",
          })}`,
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
            <span className="ml-2">{`${t("TOKENS", { ns: "settings" })}`}</span>
          </>
        }
        value={settings.maxTokens ?? 400}
        disabled={disabled}
        onChange={(e) =>
          updateSettings("maxTokens", parseFloat(e.target.value))
        }
        type="range"
        toolTipProperties={{
          message: `${t("CONTROL_MAXIMUM_OF_TOKENS_DESCRIPTION", {
            ns: "settings",
          })}`,
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
      header={`${t("SETTINGS_DIALOG_HEADER", {
        ns: "settings",
      })}`}
      isShown={show}
      close={close}
      footerButton={
        <>
          <Button className="bg-red-400 hover:bg-red-500" onClick={handleReset}>
            {`${t("RESET", {
              ns: "common",
            })}`}
          </Button>
          <Button onClick={handleSave}>{`${t("SAVE", {
            ns: "common",
          })}`}</Button>
        </>
      }
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
            {`${t("INFO_TO_USE_GPT4", { ns: "settings" })}`}
            &nbsp;
            <a
              href="https://openai.com/waitlist/gpt-4-api"
              className="text-blue-500"
            >
              {`${t("HERE", "HERE", { ns: "settings" })}`}
            </a>
            .&nbsp;{" "}
            {`${t("SUBSCRIPTION_WILL_NOT_WORK", {
              ns: "settings",
            })}`}
          </b>
        </p>
      )}
      <div className="mt-2 flex flex-col gap-2">
        <Input
          left={
            <>
              <FaKey />
              <span className="ml-2">{`${t("API_KEY", {
                ns: "settings",
              })}`}</span>
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
              <span className="ml-2">{`${t("LABEL_MODEL", {
                ns: "settings",
              })}`}</span>
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
      </div>
    </Dialog>
  );
};
