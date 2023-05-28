import React, { useEffect } from "react";
import Button from "./Button";
import { FaCoins, FaMicrochip, FaSyncAlt, FaThermometerFull } from "react-icons/fa";
import Dialog from "./Dialog";
import Input from "./Input";
import { GPT_MODEL_NAMES } from "../utils/constants";
import Accordion from "./Accordion";
import type { ModelSettings, SettingModel } from "../utils/types";
import LanguageCombobox from "./LanguageCombobox";
import { translate } from "../utils/translate";

export const SettingsDialog: React.FC<{
  show: boolean;
  close: () => void;
  customSettings: SettingModel;
}> = ({ show, close, customSettings }) => {
  const [settings, setSettings] = React.useState<ModelSettings>({
    ...customSettings.settings,
  });

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
            <span className="ml-2">{`${translate("TEMPERATURE", "settings")}`}</span>
          </>
        }
        value={settings.customTemperature}
        onChange={(e) => updateSettings("customTemperature", parseFloat(e.target.value))}
        type="range"
        toolTipProperties={{
          message: `${translate("HIGHER_VALUES_MAKE_OUTPUT_MORE_RANDOM", "settings")}`,
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
            <span className="ml-2">{`${translate("LOOP", "settings")}`}</span>
          </>
        }
        value={settings.customMaxLoops}
        onChange={(e) => updateSettings("customMaxLoops", parseFloat(e.target.value))}
        type="range"
        toolTipProperties={{
          message: `${translate("CONTROL_THE_MAXIMUM_NUM_OF_LOOPS", "settings")}`,
          disabled: false,
        }}
        attributes={{
          min: 1,
          max: 25,
          step: 1,
        }}
      />
      <Input
        left={
          <>
            <FaCoins />
            <span className="ml-2">{`${translate("TOKENS", "settings")}`}</span>
          </>
        }
        value={settings.maxTokens ?? 400}
        onChange={(e) => updateSettings("maxTokens", parseFloat(e.target.value))}
        type="range"
        toolTipProperties={{
          message: `${translate("CONTROL_MAXIMUM_OF_TOKENS_DESCRIPTION", "settings")}`,
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
      header={`${translate("SETTINGS_DIALOG_HEADER", "settings")}`}
      isShown={show}
      close={close}
      footerButton={
        <>
          <Button className="bg-red-400 hover:bg-red-500" onClick={handleReset}>
            {`${translate("RESET", "common")}`}
          </Button>
          <Button onClick={handleSave}>{`${translate("SAVE", "common")}`}</Button>
        </>
      }
    >
      <div className="mt-2 flex w-full flex-col gap-2">
        <LanguageCombobox />
        <Input
          left={
            <>
              <FaMicrochip />
              <span className="ml-2">{`${translate("LABEL_MODEL", "settings")}`}</span>
            </>
          }
          type="combobox"
          value={settings.customModelName}
          onChange={() => null}
          setValue={(e) => updateSettings("customModelName", e)}
          attributes={{ options: GPT_MODEL_NAMES }}
        />
        <Accordion child={advancedSettings} name={translate("ADVANCED_SETTINGS", "settings")} />
      </div>
    </Dialog>
  );
};
