import { useTranslation } from "next-i18next";
import React from "react";

import Badge from "./Badge";
import BannerBadge from "./BannerBadge";
import PopIn from "./motions/popin";

const AppTitle = () => {
  const { i18n } = useTranslation();

  return (
    <div id="title" className="relative flex flex-col items-center font-mono">
      <div className="flex flex-row items-start">
        <span className="text-4xl font-bold text-[#C0C0C0] xs:text-5xl sm:text-6xl">Agent</span>
        <span className="text-4xl font-bold text-white xs:text-5xl sm:text-6xl">GPT</span>
        <PopIn delay={0.5}>
          <Badge colorClass="bg-gradient-to-t from-sky-500 to-sky-600 border-2 border-white/20 sm:absolute translate-y-2">
            {i18n?.t("BETA", {
              ns: "indexPage",
            })}
            &nbsp;🚀
          </Badge>
        </PopIn>
      </div>
      <div className="mt-3 text-center font-mono text-[0.7em] font-bold text-white">
        <div>
          <BannerBadge
            className="md:hidden"
            onClick={() => {
              window.open("https://6h6bquxo5g1.typeform.com/to/qscfsOf1", "_blank");
            }}
          >
            Apply to automate your business with Agents
          </BannerBadge>
        </div>
        <div
          className="hidden md:flex"
          onClick={() => {
            window.open("https://6h6bquxo5g1.typeform.com/to/qscfsOf1", "_blank");
          }}
        >
          <BannerBadge>Interested in automating businesses with AI Agents? Apply here</BannerBadge>
        </div>
      </div>
    </div>
  );
};

export default AppTitle;
