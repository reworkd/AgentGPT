import React, { useEffect } from "react";
import Button from "../Button";
import { FaCoins, FaMicrochip, FaSyncAlt, FaThermometerFull } from "react-icons/fa";
import Dialog from "./Dialog";
import Input from "../Input";
import { GPT_MODEL_NAMES } from "../../utils/constants";
import Accordion from "../Accordion";
import type { ModelSettings, SettingModel } from "../../utils/types";
import LanguageCombobox from "../LanguageCombobox";
import { useTranslation } from "next-i18next";
import { env } from "../../env/client.mjs";

export const SettingsDialog: React.FC<{
  show: boolean;
  close: () => void;
  customSettings: SettingModel;
}> = ({ show, close, customSettings }) => {
  const [settings, setSettings] = React.useState<ModelSettings>({
    ...customSettings.settings,
  });
  const [t] = useTranslation();

  useEffect(() => {
    setSettings(customSettings.settings);
  }, [customSettings, close]);

  const updateSettings = <Key extends keyof ModelSettings>(key: Key, value: ModelSettings[Key]) => {
    setSettings((prev) => {
      return { ...prev, [key]: value };
    });
  };

  const handleSave = () => {
    customSettings.saveSettings(settings);
    close();
    return;
  };

  const handleReset = () => {
    customSettings.resetSettings();
    close();
  };

  const advancedSettings = (
    <div className="flex flex-col gap-2">
      <Input
        left={
          <>
            <FaThermometerFull />
            <span className="ml-2">{`${t("TEMPERATURE", { ns: "settings" })}`}</span>
          </>
        }
        value={settings.customTemperature}
        onChange={(e) => updateSettings("customTemperature", parseFloat(e.target.value))}
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
        onChange={(e) => updateSettings("customMaxLoops", parseFloat(e.target.value))}
        type="range"
        toolTipProperties={{
          message: `${t("CONTROL_THE_MAXIMUM_NUM_OF_LOOPS", {
            ns: "settings",
          })}`,
          disabled: false,
        }}
        attributes={{
          min: 1,
          max: env.NEXT_PUBLIC_MAX_LOOPS,
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
        onChange={(e) => updateSettings("maxTokens", parseFloat(e.target.value))}
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
      <div className="mt-2 flex w-full flex-col gap-2">
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
        />
        <Accordion child={advancedSettings} name={t("ADVANCED_SETTINGS", { ns: "settings" })} />
      </div>
    </Dialog>
  );
};
