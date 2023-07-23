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
                <div className="max-w-2xl w-full justify-starts">
                    <div className="h-20 border-b-[1px] p-4 mb-6 border-white/10">
                        <h1 className="text-3xl font-semibold text-gray-300">Organization</h1>
                        <span className="font-light text-white/50 font-sm">Manage your Organization settings</span>
                    </div>
                    <div className=" border-b-[1px] border-white/10 p-4 mb-6">
                        <h2 className="text-lg text-gray-300 font-light">Logo</h2>
                        <div className="w-20 h-20 rounded-sm bg-gray-400 my-4"></div>
                        <span className="font-light text-white/50">Pick a logo for your Oraganization</span>
                    </div>
                    <div className="border-b-[1px] border-white/10 p-4 mb-6">
                        <div className="max-w-sm">
                            <h2 className="text-lg text-gray-300 font-light">General </h2>
                            <div className="mt-4">
                                <label htmlFor="organizationName" className="block text-sm font-light text-gray-300">
                                Organization Name
                                </label>
                                <input
                                type="text"
                                id="organizationName"
                                className="w-full py-2 px-3 bg-gray-900 text-white border border-white/20 rounded mt-1 focus:ring-white focus:border-white"
                                placeholder="Enter organization name"
                                />
                            </div>
                            <div className="mt-4">
                                <label htmlFor="organizationUrl" className="block text-sm font-light text-gray-300">
                                Organization URL
                                </label>
                                <input
                                type="text"
                                id="organizationUrl"
                                className="w-full py-2 px-3 bg-gray-900 text-white border border-white/20 rounded mt-1 focus:ring-white focus:border-white"
                                placeholder="Enter organization URL"
                                />
                            </div>
                            <button
                                className="bg-purple-400/20 text-white py-2 px-4 mt-4 rounded hover:bg-purple-400/20 focus:outline-none focus:ring-2 focus:ring-purple-400/30"
                                >
                                Update
                            </button>
                        </div>
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