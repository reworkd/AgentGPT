import DashboardLayout from "../layout/dashboard";
import type { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useState } from "react";
import nextI18NextConfig from "../../next-i18next.config.js";
import { languages } from "../utils/languages";

const OrganizationManagement = () => {
    return (
        <DashboardLayout> 
            <div className="relative w-full h-screen bg-gray-800">
                <div className="max-w-2xl justify-center text-white">

                    <div>Title Section</div>
                    <div>Logo Section</div>
                    <div>General Section</div>
                    <div>Member Manage Section</div>
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