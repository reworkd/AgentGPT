import {
  FaAppleAlt,
  FaBlog,
  FaBookOpen,
  FaBookReader,
  FaCalendarAlt,
  FaChartLine,
  FaDumbbell,
  FaFileAlt,
  FaGamepad,
  FaGraduationCap,
  FaHashtag,
  FaLaptopCode,
  FaMoneyBillWave,
  FaPlaneDeparture,
  FaRegEnvelope,
  FaRegNewspaper,
} from "react-icons/fa";

export const TEMPLATE_DATA: TemplateModel[] = [
  {
    name: "PlatformerGPT",
    icon: <FaGamepad />,
    category: "Creative and Social",
    description: "Write some code to make a platformer game.",
    promptTemplate: "Write some code to make a platformer game about 'Mario'.",
    placeholder: "Mario",
  },
  {
    name: "ResearchGPT",
    icon: <FaBookReader />,
    category: "Academics and Professional",
    description: "Create a comprehensive report of a topic of your choice",
    promptTemplate: "Create a comprehensive report of 'Global Warming'.",
    placeholder: "Global Warming",
  },
  {
    name: "TravelGPT",
    icon: <FaPlaneDeparture />,
    category: "Other",
    description: "Plan a detailed trip to destination",
    promptTemplate: "Plan a detailed trip to 'Paris'.",
    placeholder: "Paris",
  },
  {
    name: "ScraperGPT",
    icon: <FaLaptopCode />,
    category: "Other",
    description: "Scrap a website of your choice",
    promptTemplate: "Scrap 'IMDb' website and summarize the details",
    placeholder: "IMDb",
  },
  {
    name: "PostGPT",
    icon: <FaHashtag />,
    category: "Creative and Social",
    description: "Thinks of captions and hashtags for your social media posts",
    promptTemplate:
      "Create a caption and hashtags for a social media post about 'Summer Vacation'.",
    placeholder: "Summer Vacation",
  },
  {
    name: "EmailGPT",
    icon: <FaRegEnvelope />,
    category: "Academics and Professional",
    description: "Compose a concise and detailed email",
    promptTemplate: "Compose a concise email about 'Project Update'.",
    placeholder: "Project Update",
  },
  {
    name: "ResumeGPT",
    icon: <FaFileAlt />,
    category: "Academics and Professional",
    description: "Create a professional resume based on your career history.",
    promptTemplate: "Create a resume detailing your experience in 'Marketing'.",
    placeholder: "Marketing",
  },
  {
    name: "NovelGPT",
    icon: <FaBookOpen />,
    category: "Creative and Social",
    description: "Start writing a novel in your chosen genre.",
    promptTemplate: "Start writing a 'Fantasy' genre novel",
    placeholder: "Fantasy",
  },
  {
    name: "DietGPT",
    icon: <FaAppleAlt />,
    category: "Health and Fitness",
    description: "Plan a personalized diet based on your dietary preferences.",
    promptTemplate: "Plan a 'Vegetarian' diet",
    placeholder: "Vegetarian",
  },
  {
    name: "FitnessGPT",
    icon: <FaDumbbell />,
    category: "Health and Fitness",
    description: "Design a workout regimen based on your fitness goals.",
    promptTemplate: "Design a workout regimen for 'Weight Loss'.",
    placeholder: "Weight Loss",
  },
  {
    name: "MarketingGPT",
    icon: <FaChartLine />,
    category: "Academics and Professional",
    description: "Create a comprehensive marketing plan for your business.",
    promptTemplate: "Create a comprehensive marketing plan for 'Startup'.",
    placeholder: "Startup",
  },
  {
    name: "BudgetGPT",
    icon: <FaMoneyBillWave />,
    category: "Academics and Professional",
    description: "Prepare a personal or family budget plan.",
    promptTemplate: "Prepare a budget for 'Family Vacation'.",
    placeholder: "Family Vacation",
  },
  {
    name: "StudyGPT",
    icon: <FaGraduationCap />,
    category: "Academics and Professional",
    description: "Create a study schedule based on your academic goals.",
    promptTemplate: "Create a study schedule for 'Final Exams'.",
    placeholder: "Final Exams",
  },
  {
    name: "NewsGPT",
    icon: <FaRegNewspaper />,
    category: "Other",
    description: "Write a detailed news article on a topic of your choice.",
    promptTemplate: "Write a news article on 'Technology Advancements'.",
    placeholder: "Technology Advancements",
  },
  {
    name: "EventPlannerGPT",
    icon: <FaCalendarAlt />,
    category: "Other",
    description: "Plan a detailed schedule for your upcoming event.",
    promptTemplate: "Plan a detailed schedule for 'Music Festival' event",
    placeholder: "Music Festival",
  },
  {
    name: "BlogGPT",
    icon: <FaBlog />,
    category: "Creative and Social",
    description: "Compose a blog post on a topic of your choice.",
    promptTemplate: "Compose a blog post about 'Healthy Living'.",
    placeholder: "Healthy Living",
  },
];

export interface TemplateModel {
  name: string;
  icon: JSX.Element;
  category: string;
  description: string;
  promptTemplate: string;
  placeholder: string;
}
