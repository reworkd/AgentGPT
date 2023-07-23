import DashboardLayout from "../layout/dashboard";
import type { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useState } from "react";
import nextI18NextConfig from "../../next-i18next.config.js";
import { languages } from "../utils/languages";

const OrganizationManagement = () => {
    return (
        <DashboardLayout> 
            <div className="flex justify-center items-center w-full h-screen bg-gray-800">
                <div className="max-w-2xl justify-starts">
                    <div className="h-20 border-b-2 border-white/20">
                        <h1 className="text-3xl font-semibold text-gray-300">Organization</h1>
                        <span className="font-light text-white/50 font-sm">Manage your Organization settings</span>
                    </div>
                    <div className=" border-b-2 border-white/20 p-4 mb-6">
                        <h2 className="text-lg text-white/30 font-light">Logo</h2>
                        <div className="w-20 h-20 rounded-sm bg-gray-400 my-4"></div>
                        <span className="font-light text-white/30">Pick a logo for your workspace</span>
                    </div>
                    <div className="bg-gray-800 bg-opacity-20 border border-gray-300 rounded p-4 mb-6">
                        <h2 className="text-lg font-semibold">General Section</h2>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default OrganizationManagement;

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
    const supportedLocales = languages.map((language) => language.code);
    const chosenLocale = supportedLocales.includes(locale) ? locale : "en";
  
    return {
      props: {
        ...(await serverSideTranslations(chosenLocale, nextI18NextConfig.ns)),
      },
    };
  };