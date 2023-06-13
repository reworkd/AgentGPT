import SidebarLayout from "../layout/sidebar";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useState, useEffect } from "react";
import nextI18NextConfig from "../../next-i18next.config.js";
import { languages } from "../utils/languages";
import { GetStaticProps } from "next";
import { TEMPLATE_DATA } from "../components/templates/TemplateData";
import TemplateCard from "../components/templates/TemplateCard";
import FadeIn from "../components/motions/FadeIn";
import SearchBar from "../components/templates/TemplateSearch";  

const Templates = () => {
  return (
    <SidebarLayout>
      <div className="w-full h-full p-10">
        <FadeIn initialX={-45} initialY={0}>
          <h1 className="text-4xl text-white font-bold">Templates</h1>
          <h2 className="text-xl text-white font-thin mb-4">Customizable and ready to deploy agents</h2>        </FadeIn>
        <FadeIn initialY={45}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {TEMPLATE_DATA.map(model => (
              <TemplateCard key={model.name + model.description} model={model}/>
            ))}
          </div>
        </FadeIn>
      </div>
    </SidebarLayout>
  );
};

export default Templates;

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const supportedLocales = languages.map((language) => language.code);
  const chosenLocale = supportedLocales.includes(locale) ? locale : "en";

  return {
    props: {
      ...(await serverSideTranslations(chosenLocale, nextI18NextConfig.ns)),
    },
  };
};
