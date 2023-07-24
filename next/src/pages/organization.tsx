import DashboardLayout from "../layout/dashboard";
import type { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useState } from "react";
import nextI18NextConfig from "../../next-i18next.config.js";
import { languages } from "../utils/languages";
import { FaEllipsisH } from "react-icons/fa";
import PrimaryButton from "../components/PrimaryButton";
import Input from "../components/Input";

const OrganizationManagement = () => {
    return (
        <DashboardLayout> 
            <div className="flex justify-center items-center w-full h-screen bg-zinc-900">
                <div className="max-w-4xl w-full font-mono justify-starts">
                    <div className="border-b p-4 my-2 border-white/10">
                        <h1 className="text-3xl font-semibold text-gray-300">Organization</h1>
                        <span className="text-lg text-white/50">Manage your Organization settings</span>
                    </div>
                    <div className=" border-b border-white/10 p-4 mb-2">
                        <h2 className="text-2xl text-gray-300">Logo</h2>
                        <div className="w-40 h-40 rounded-lg bg-white my-4"></div>
                        <span className="text-white/50 text-lg">Pick a logo for your Oraganization</span>
                    </div>
                    <div className="border-b border-white/10 p-4 mb-6">
                        <div className="max-w-sm">
                            <h2 className="text-2xl text-gray-300">General </h2>
                            <div className="mt-4">
                                <label htmlFor="organizationName" className="block text-white/50 text-lg mb-4 text-gray-300">
                                Organization Name
                                </label>
                                <Input
                                type="text"
                                id="organizationName"
                                placeholder="Enter organization name"
                                />
                            </div>
                            <div className="mt-4">
                                <label htmlFor="organizationUrl" className="block text-white/50 text-lg mb-4 text-gray-300">
                                Organization URL
                                </label>
                                <Input
                                type="text"
                                id="organizationUrl"
                                placeholder="Enter organization URL"
                                />
                            </div>
                            <PrimaryButton
                                className="py-2 px-4 mt-6"
                                >
                                Update
                            </PrimaryButton>
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