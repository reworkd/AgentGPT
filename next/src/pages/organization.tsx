import DashboardLayout from "../layout/dashboard";
import type { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useState } from "react";
import nextI18NextConfig from "../../next-i18next.config.js";
import { languages } from "../utils/languages";
import { FaEllipsisH } from "react-icons/fa";

const OrganizationManagement = () => {
    return (
        <DashboardLayout> 
            <div className="flex justify-center items-center w-full h-screen bg-gray-900">
                <div className="max-w-4xl w-full justify-starts">
                    <div className="h-20 border-b-[1px] p-4 my-6 border-white/10">
                        <h1 className="text-3xl font-semibold text-gray-300">Organization</h1>
                        <span className="font-light text-sm text-white/50 font-sm">Manage your Organization settings</span>
                    </div>
                    <div className=" border-b-[1px] border-white/10 p-4 mb-6">
                        <h2 className="text-lg text-gray-300 font-light">Logo</h2>
                        <div className="w-20 h-20 rounded-sm bg-purple-400 my-4"></div>
                        <span className="font-light text-white/50 text-sm">Pick a logo for your Oraganization</span>
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
                                className="w-full py-2 px-3 bg-gray-900 text-white border text-sm border-white/20 rounded mt-1 focus:ring-white focus:border-white"
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
                                className="w-full py-2 px-3 bg-gray-900 text-white text-sm border border-white/20 rounded mt-1 focus:ring-white focus:border-white"
                                placeholder="Enter organization URL"
                                />
                            </div>
                            <button
                                className="block bg-purple-400 text-white py-2 text-sm px-4 mt-4 rounded shadow-sm hover:bg-purple-300 transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400/30"
                                // onClick={handleUpload}
                                >
                                Update
                            </button>
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="sm:flex mb-6 sm:items-center">
                            <div className="sm:flex-auto">
                                <h1 className="text-gray-300 font-light">Manage members</h1>
                                <p className="mt-2 font-light text-white/50 text-sm">
                                A list of all the users in your account including their name, title, email, and role.
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-between mt-4 sm:mt-0">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-gray-900 text-sm flex-grow max-w-sm text-white border border-white/20 rounded mt-1 focus:ring-white focus:border-white"
                            />
                            <button
                            type="button"
                            className="block rounded bg-purple-400 px-3 py-1 text-center text-sm text-white shadow-sm hover:bg-purple-300 transition duration-300 focus:ring-purple-400/30"
                            >
                            Invite 
                            </button>
                        </div>
                        <div className="mt-8 flow-root">
                            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                <div className="inline-block min-w-full  py-2 align-middle sm:px-6 lg:px-8">
                                    <table className="min-w-full bg-transparent ">
                                    <tbody>
                                         {/* {people.map((person) => ( */}
                                        {/* <tr key={person.email}> */}
                                            <td className="py-5 border-b border-transparent pl-4 pr-3 text-sm sm:pl-0">
                                            <div className="flex items-center">
                                                <div className="h-11 w-11">
                                                {/* <img className="h-11 w-11 rounded-full" src={person.image} alt="" /> */}
                                                <img className="h-11 w-11 rounded-full bg-white"  alt="" />
                                                
                                                </div>
                                                <div className="ml-4">
                                                {/* <div className="font-medium text-gray-900">{person.name}</div> */}
                                                <div className="font-light text-white/50">Jaskaran</div>
                                                {/* <div className="mt-1 text-gray-500">{person.email}</div> */}
                                                <div className="mt-1 font-light text-gray-500">JasKaran@gmail.com</div>
                                                </div>
                                            </div>
                                            </td>
                                            {/* <td className="px-3 py-4 text-sm text-white/50">{person.role}</td> */}
                                            <td className="px-3 py-4 border-b border-transparent text-sm text-white/50">Admin</td>
                                            <td className="border-b border-transparent relative py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                            <a href="#" className="text-white/50 text-lg">
                                                {/* Edit<span className="sr-only">, {person.name}</span> */}
                                                <FaEllipsisH 
                                                    onClick={() => console.log("clicked")}
                                                />
                                            </a>
                                            </td>
                                        {/* </tr> */}
                                        {/* ))}  */}
                                    </tbody>
                                    </table>
                                </div>
                            </div>
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