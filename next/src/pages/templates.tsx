import SidebarLayout from "../layout/sidebar";
import Expand from "../components/motions/expand";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useState } from "react";
import nextI18NextConfig from "../../next-i18next.config.js";
import { languages } from "../utils/languages";
import { GetStaticProps } from "next";
import AppTitle from "../components/AppTitle";

const categoryColors = {
    "Games": "red",
    "Academics": "red",
    "Travel": "red",
    "Web": "red",
    "Social Media": "red",
    "Communications": "red",
    "Career": "red",
    "Creative Writing": "red",
    "Health & Wellness": "red",
    "Business": "red",
    "Personal Finance": "red",
    "News & Media": "red",
    "Event Planning": "red",
    "Blogging": "red"
}



const Template = () => {
  const [activeCard, setActiveCard] = useState(null);
  const [prompt, setPrompt] = useState(null);
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All');
  
  
  const cards = [
    { name: "PlatformerGPT  🎮", category: "Games", description: "Write some code to make a platformer game.", promptTemplate: "Write some code to make _______" },
    { name: "ResearchGPT  📜", category: "Academics", description: "Create a comprehensive report of a topic of your choice", promptTemplate: "Create a comprehensive report of _______" },
    { name: "TravelGPT  🌴", category: "Travel", description: "Plan a detailed trip to destination", promptTemplate: "Plan a detailed trip to _______" },
    { name: "ScraperGPT  ⚒️", category: "Web", description: "Scrap a website of your choice", promptTemplate: "Scrap _______ website and summarize the details" },
    { name: "PostGPT  📮", category: "Social Media", description: "Thinks of captions and hashtags for your social media posts", promptTemplate: "Create a caption and hashtags for a social media post about _______" },
    { name: "EmailGPT  📧 ", category: "Communications", description: "Compose a concise and detailed email", promptTemplate: "Compose a concise email about _______" },
    { name: "ResumeGPT  📝", category: "Career", description: "Create a professional resume based on your career history.", promptTemplate: "Create a resume detailing your experience in _______" },
    { name: "NovelGPT  📚", category: "Creative Writing", description: "Start writing a novel in your chosen genre.", promptTemplate: "Start writing a _______ genre novel" },
    { name: "DietGPT  🥗", category: "Health & Wellness", description: "Plan a personalized diet based on your dietary preferences.", promptTemplate: "Plan a _______ diet" },
    { name: "FitnessGPT  🏋️", category: "Health & Wellness", description: "Design a workout regimen based on your fitness goals.", promptTemplate: "Design a workout regimen for _______" },
    { name: "MarketingGPT  📈", category: "Business", description: "Create a comprehensive marketing plan for your business.", promptTemplate: "Create a comprehensive marketing plan for _______" },
    { name: "BudgetGPT  💰", category: "Personal Finance", description: "Prepare a personal or family budget plan.", promptTemplate: "Prepare a budget for _______" },
    { name: "StudyGPT  📖", category: "Academics", description: "Create a study schedule based on your academic goals.", promptTemplate: "Create a study schedule for _______" },
    { name: "NewsGPT  📰", category: "News & Media", description: "Write a detailed news article on a topic of your choice.", promptTemplate: "Write a news article on _______" },
    { name: "EventPlannerGPT  🎉", category: "Event Planning", description: "Plan a detailed schedule for your upcoming event.", promptTemplate: "Plan a detailed schedule for _______ event" },
    { name: "BlogGPT  📝", category: "Blogging", description: "Compose a blog post on a topic of your choice.", promptTemplate: "Compose a blog post about _______" }

];

const filteredCards = cards.filter(card => 
    (card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.category.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (category === 'All' || card.category === category)
  );

  const deployPrompt = () => {
    const combinedPrompt = cards[activeCard]?.promptTemplate.replace("_______", prompt);
    console.log("Prompt:", combinedPrompt);
    setIsPromptOpen(false);
  };

  return (
    <SidebarLayout>
      <AppTitle />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="m-3 bg-white rounded">
            <div className="relative m-4 flex w-full flex-wrap items-stretch">
                <div className="flex w-full items-center justify-between space-x-3">
                  <div className="w-1/3">
                    <select id="category" name="category" className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" onChange={(e) => setCategory(e.target.value)}>
                      <option>All</option>

                    <option>Games</option>
                    <option>Academics</option>
                    <option>Travel</option>
                    <option>Web</option>
                    <option>Social Media</option>
                    <option>Communications</option>
                    <option>Career</option>
                    <option>Creative Writing</option>
                    <option>Health & Wellness</option>
                    <option>Business</option>
                    <option>Personal Finance</option>
                    <option>News & Media</option>
                    <option>Event Planning</option>
                    <option>Blogging</option>
                    {/* Add more categories as needed */}
                    </select>
                  </div>
                  <div className="w-2/3">
                    <input
                      type="search"
                      className="block w-full rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="Search"
                      aria-label="Search"
                      aria-describedby="button-addon2" 
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
            </div>
        </div>

        <div className="flex items-center justify-center min-h-[200px] ">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredCards.map((card, index) => (
            <Expand
                className={`p-2 aspect-content aspect-w-1 aspect-h-1 border-black rounded bg-${activeCard === index ? 'white' : 'gray-500'} transform transition-transform duration-500 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xl`}
                key={index}
                onClick={() => {
                setActiveCard(index);
                setIsPromptOpen(true);
                }}
            >
                <div className={`text-xs mb-1 inline-block px-2 bg-${categoryColors[card.category]}-500 rounded-full`}>{card.category}</div>
                <div className={`h-full overflow-auto ${activeCard === index ? 'scale-110' : ''}`}>
                <div className={`font-bold text-lg text-${activeCard === index ? 'gray-900' : 'white'} mb-2`}>{card.name}</div>
                <div className={`text-sm text-${activeCard === index ? 'gray-700' : 'gray-300'}`}>
                    {activeCard === index ? card.promptTemplate : card.description}
                </div>
                </div>
            </Expand>
            ))}


        </div> 
      </div>
    </div>
    {isPromptOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-all duration-300 ease-in-out">
        <div className="p-4 border border-gray-200 rounded shadow-lg transform scale-110 bg-white cursor-pointer transition-all duration-300 ease-in-out">
          <div className="space-y-4">
            <div className="font-bold text-lg">{cards[activeCard]?.name}</div>
            <div className="text-sm">{cards[activeCard]?.promptTemplate}</div>
            <input
                type="search"
                class="..."
                placeholder="Search"
                aria-label="Search"
                aria-describedby="button-addon2" 
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                onClick={() => setIsPromptOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                onClick={deployPrompt}
              >
                Deploy
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </SidebarLayout>
  );
};

export default Template;

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const supportedLocales = languages.map((language) => language.code);
  const chosenLocale = supportedLocales.includes(locale) ? locale : "en";

  return {
    props: {
      ...(await serverSideTranslations(chosenLocale, nextI18NextConfig.ns)),
    },
  };
};