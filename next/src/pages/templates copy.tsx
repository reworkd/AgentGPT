import SidebarLayout from "../layout/sidebar";
import Expand from "../components/motions/expand";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useState } from "react";
import nextI18NextConfig from "../../next-i18next.config.js";
import { languages } from "../utils/languages";
import { GetStaticProps } from "next";
import AppTitle from "../components/AppTitle";

const categoryColors = {
    "Games": "bg-teal-400",
    "Academics": "bg-pink-900",
    "Travel": "bg-blue-500",
    "Web": "bg-green-600",
    "Social Media": "bg-yellow-500",
    "Communications": "bg-indigo-500",
    "Career": "bg-purple-700",
    "Creative Writing": "bg-red-500",
    "Health & Wellness": "bg-green-500",
    "Business": "bg-blue-600",
    "Personal Finance": "bg-yellow-600",
    "News & Media": "bg-red-600",
    "Event Planning": "bg-indigo-600",
    "Blogging": "bg-purple-500"
  }
  

const Template = () => {
  const [activeCard, setActiveCard] = useState(null);
  const [prompt, setPrompt] = useState(null);
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [promptInput, setPromptInput] = useState("");
  
  const cards = [
    { name: "PlatformerGPT  🎮", category: "Games", description: "Write some code to make a platformer game.", promptTemplate: "Write some code to make a platformer game about 'Mario'.", placeholder: "Mario"},
    { name: "ResearchGPT  📜", category: "Academics", description: "Create a comprehensive report of a topic of your choice", promptTemplate: "Create a comprehensive report of 'Global Warming'.", placeholder: "Global Warming" },
    { name: "TravelGPT  🌴", category: "Travel", description: "Plan a detailed trip to destination", promptTemplate: "Plan a detailed trip to 'Paris'.", placeholder: "Paris" },
    { name: "ScraperGPT  ⚒️", category: "Web", description: "Scrap a website of your choice", promptTemplate: "Scrap 'IMDb' website and summarize the details", placeholder: "IMDb" },
    { name: "PostGPT  📮", category: "Social Media", description: "Thinks of captions and hashtags for your social media posts", promptTemplate: "Create a caption and hashtags for a social media post about 'Summer Vacation'.", placeholder: "Summer Vacation" },
    { name: "EmailGPT  📧 ", category: "Communications", description: "Compose a concise and detailed email", promptTemplate: "Compose a concise email about 'Project Update'.", placeholder: "Project Update" },
    { name: "ResumeGPT  📝", category: "Career", description: "Create a professional resume based on your career history.", promptTemplate: "Create a resume detailing your experience in 'Marketing'.", placeholder: "Marketing" },
    { name: "NovelGPT  📚", category: "Creative Writing", description: "Start writing a novel in your chosen genre.", promptTemplate: "Start writing a 'Fantasy' genre novel", placeholder: "Fantasy" },
    { name: "DietGPT  🥗", category: "Health & Wellness", description: "Plan a personalized diet based on your dietary preferences.", promptTemplate: "Plan a 'Vegetarian' diet", placeholder: "Vegetarian" },
    { name: "FitnessGPT  🏋️", category: "Health & Wellness", description: "Design a workout regimen based on your fitness goals.", promptTemplate: "Design a workout regimen for 'Weight Loss'.", placeholder: "Weight Loss" },
    { name: "MarketingGPT  📈", category: "Business", description: "Create a comprehensive marketing plan for your business.", promptTemplate: "Create a comprehensive marketing plan for 'Startup'.", placeholder: "Startup" },
    { name: "BudgetGPT  💰", category: "Personal Finance", description: "Prepare a personal or family budget plan.", promptTemplate: "Prepare a budget for 'Family Vacation'.", placeholder: "Family Vacation" },
    { name: "StudyGPT  📖", category: "Academics", description: "Create a study schedule based on your academic goals.", promptTemplate: "Create a study schedule for 'Final Exams'.", placeholder: "Final Exams" },
    { name: "NewsGPT  📰", category: "News & Media", description: "Write a detailed news article on a topic of your choice.", promptTemplate: "Write a news article on 'Technology Advancements'.", placeholder: "Technology Advancements" },
    { name: "EventPlannerGPT  🎉", category: "Event Planning", description: "Plan a detailed schedule for your upcoming event.", promptTemplate: "Plan a detailed schedule for 'Music Festival' event", placeholder: "Music Festival" },
    { name: "BlogGPT  📝", category: "Blogging", description: "Compose a blog post on a topic of your choice.", promptTemplate: "Compose a blog post about 'Healthy Living'.", placeholder: "Healthy Living" },
    { name: "CourseGPT  🎓", category: "Academics", description: "Design a course outline for your chosen subject.", promptTemplate: "Design a course outline for 'Physics'.", placeholder: "Physics" },
    { name: "FashionGPT  👗", category: "Creative Writing", description: "Write a detailed fashion critique for a chosen clothing item.", promptTemplate: "Write a fashion critique for 'Vintage Dresses'.", placeholder: "Vintage Dresses" },
    { name: "PortfolioGPT  🎨", category: "Career", description: "Craft an impressive portfolio based on your creative work.", promptTemplate: "Craft an impressive portfolio for a 'Graphic Designer'.", placeholder: "Graphic Designer" },
    { name: "CookingGPT  🍽️", category: "Health & Wellness", description: "Create a detailed recipe based on your favorite dish.", promptTemplate: "Create a recipe for 'Spaghetti Carbonara'.", placeholder: "Spaghetti Carbonara" },
    { name: "CampaignGPT  🚀", category: "Business", description: "Create a campaign plan for your new product.", promptTemplate: "Create a campaign plan for 'Smart Watch'.", placeholder: "Smart Watch" },
    { name: "InvestGPT  💼", category: "Personal Finance", description: "Craft an investment plan based on your financial goals.", promptTemplate: "Craft an investment plan for 'Retirement'.", placeholder: "Retirement" },
    { name: "ReviewGPT  📃", category: "Blogging", description: "Write a detailed review of your chosen product.", promptTemplate: "Write a review for 'iPhone 13'.", placeholder: "iPhone 13" },
    { name: "CinemaGPT  🎬", category: "News & Media", description: "Write a detailed review or critique of a movie.", promptTemplate: "Write a review for the movie 'Avengers: Endgame'.", placeholder: "Avengers: Endgame" },
    { name: "WeddingGPT  💍", category: "Event Planning", description: "Plan a detailed schedule for a wedding.", promptTemplate: "Plan a detailed schedule for a 'Beach Wedding'.", placeholder: "Beach Wedding" },
    { name: "MemeGPT  😄", category: "Social Media", description: "Create humorous meme captions for your social media posts.", promptTemplate: "Create a meme caption for a post about 'Cats'.", placeholder: "Cats" },
    { name: "TourGPT  🏛️", category: "Travel", description: "Plan a detailed tour of a city or historical place.", promptTemplate: "Plan a detailed tour of 'Rome'.", placeholder: "Rome" },
    { name: "BackendGPT  🔧", category: "Web", description: "Design a backend system for a web application.", promptTemplate: "Design a backend system for a 'E-commerce site'.", placeholder: "E-commerce site" },
    { name: "PresentationGPT  🖥️", category: "Communications", description: "Create a compelling presentation on a given topic.", promptTemplate: "Create a compelling presentation on 'Artificial Intelligence'.", placeholder: "Artificial Intelligence" }
    
  ];
  

const filteredCards = cards.filter(card => 
    (card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.category.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (category === 'All' || card.category === category)
  );

const deployPrompt = () => {
  const currentCard = cards[activeCard];
  if (currentCard) {
    const combinedPrompt = currentCard.promptTemplate.replace(currentCard.placeholder, promptInput);
    console.log("Prompt:", combinedPrompt);
    setIsPromptOpen(false);
  }
};

  

  return (
    <SidebarLayout>
      <AppTitle/>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="m-4 bg-black shadow-md rounded-lg p-2 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 border-2 border-white">
            <div className="flex-grow flex space-x-2 w-full">
                <input
                type="search"
                className="flex-grow px-3 py-1 border border-gray-300 rounded-md placeholder-gray-500 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search"
                aria-label="Search"
                aria-describedby="button-addon2"
                onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="hidden sm:inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Enter
                </button>
            </div>
            <div className="w-full sm:w-auto">
                <select id="category" name="category" className=" block w-full py-1 px-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" onChange={(e) => setCategory(e.target.value)}>
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
                </select>
            </div>
          </div>
        <div className="flex flex-wrap justify-center min-h-[100px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredCards.map((card, index) => (
                  <Expand
                    className={`p-2 aspect-content max-w-[350px] border-2 border-white rounded bg-${activeCard === index ? 'black' : 'black'} transform transition-transform duration-500 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xl`}
                    key={index}
                    onClick={() => {
                      setActiveCard(index);
                      setIsPromptOpen(true);
                    }}
                  >
                      <div className={`text-xs mb-1 inline-block px-2 ${categoryColors[card.category]} rounded-full`}>{card.category}</div>
                      <div className={`h-full min-h-[100px] ${activeCard === index ? 'scale-100' : ''}`}>
                          <div className={`font-bold text-lg text-${activeCard === index ? 'white' : 'white'} mb-2`}>{card.name}</div>
                          <div className={`text-sm text-${activeCard === index ? 'white' : 'white'}`}>
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
        <div className="p-4 border h-70 border-gray-200 rounded shadow-lg transform bg-black sm:max-w-xs	 lg:max-w-80 w-full">
          <div className="space-y-4">
            <div className="font-bold text-lg text-white">{cards[activeCard]?.name}</div>
            <div className={`text-xs mb-1 inline-block px-2 ${categoryColors[cards[activeCard]?.category]} rounded-full`}>{cards[activeCard]?.category}</div>
            <div className="text-sm text-white">{cards[activeCard]?.promptTemplate}</div>
            <input
                type="search"
                className="w-full px-3 py-2 text-black placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Enter your variable"
                aria-label="Variable"
                aria-describedby="button-addon2"
                onChange={(e) => setPromptInput(e.target.value)}
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