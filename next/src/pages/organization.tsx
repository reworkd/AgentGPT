import DashboardLayout from "../layout/dashboard";
import type { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import nextI18NextConfig from "../../next-i18next.config.js";
import { languages } from "../utils/languages";
import PrimaryButton from "../components/PrimaryButton";
import Input from "../ui/input";

const OrganizationManagement = () => {
  return (
    <DashboardLayout>
      <div className="flex justify-center items-center w-full h-full min-h-screen bg-zinc-900">
        <div className="max-w-4xl w-full font-sans justify-starts">
          <div className="border-b p-4 my-2 border-white/10">
            <h1 className="text-5xl mb-4 tracking-wide font-semibold text-white">
              Organization
            </h1>
            <span className="text-sm font-extralight text-white/70">
              Manage your Organization settings
            </span>
          </div>
          <div className="border-b border-white/10 p-4 mb-2">
            <h2 className="text-2xl text-white">Logo</h2>
            <div className="w-20 h-20 rounded-lg bg-white my-2"></div>
            <span className="text-white/70 text-sm font-extralight">
              Pick a logo for your Oraganization
            </span>
          </div>
          <div className="border-b border-white/10 p-4 mb-6">
            <div className="max-w-sm">
              <h2 className="text-2xl text-white">General </h2>
              <div className="mt-4">
                <Input
                  label="Organization Name"
                  name="organizationName"
                  placeholder="Enter organization name"
                />
              </div>
              <div className="mt-4">
                <Input
                  label="Organization Url"
                  name="organizationUrl"
                  placeholder="Enter organization url"
                />
              </div>
              <PrimaryButton className="px-4 mt-6">Update</PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

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
