import PopIn from "./motions/popin";
import Badge from "./Badge";
import React from "react";
import { useTranslation } from "next-i18next";

const AppTitle = () => {
  const { i18n } = useTranslation();

  return (
    <div id="title" className="relative flex flex-col items-center font-mono">
      <div className="flex flex-row items-start">
        <span className="text-4xl font-bold text-blue-base-light dark:text-shade-200-dark xs:text-5xl sm:text-6xl">
          Agent
        </span>
        <span className="text-4xl font-bold text-blue-base-light/[0.6] dark:text-shade-100-dark xs:text-5xl sm:text-6xl">
          GPT
        </span>
        <PopIn delay={0.5}>
          <Badge colorClass="background-blue-base border-2 border-color-3">
            {i18n?.t("BETA", {
              ns: "indexPage",
            })}
            &nbsp;🚀
          </Badge>
        </PopIn>
      </div>
      <div className="text-color-primary mt-1 text-center font-mono text-[0.7em] font-bold">
        <p>
          {i18n.t("HEADING_DESCRIPTION", {
            ns: "indexPage",
          })}
        </p>
      </div>
    </div>
  );
};

export default AppTitle;
