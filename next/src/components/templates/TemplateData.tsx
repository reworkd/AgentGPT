import {
  FaAppleAlt,
  FaBlog,
  FaBook,
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
  FaPalette,
  FaPlaneDeparture,
  FaRegEnvelope,
  FaRegNewspaper,
  FaShoppingCart,
  FaStarAndCrescent,
} from "react-icons/fa";

export const TEMPLATE_DATA: TemplateModel[] = [
  {
    name: "ResearchGPT",
    icon: <FaBookReader />,
    category: "Academics and Professional",
    description: "Generate a thorough report on a specific subject",
    promptTemplate:
      "Compile a comprehensive report on Global Warming, touching on its causes, effects, and mitigation strategies. Include recent research findings and statistics.",
    placeholder: "Global Warming",
  },
  {
    name: "BrandGPT",
    icon: <FaShoppingCart />,
    category: "Academics and Professional",
    description: "Evaluate a brand's performance, market position, and future prospects",
    promptTemplate:
      "Provide an in-depth analysis of the Coca-Cola brand, assessing its current market status, consumer perception, competitive positioning, and future outlook. Include potential strategies for growth.",
    placeholder: "Coca-Cola",
  },
  {
    name: "TravelGPT",
    icon: <FaPlaneDeparture />,
    category: "Other",
    description: "Plan a detailed journey to a selected destination",
    promptTemplate:
      "Outline a detailed itinerary for a 7-day trip to Paris, including sightseeing recommendations, accommodation options, and local dining experiences.",
    placeholder: "Paris",
  },
  {
    name: "PlatformerGPT",
    icon: <FaGamepad />,
    category: "Creative and Social",
    description: "Code a platformer game featuring a popular character or theme",
    promptTemplate:
      "Develop a platformer game featuring the adventures of Mario in a mysterious realm.",
    placeholder: "Mario",
  },
  {
    name: "IndustryGPT",
    icon: <FaBook />,
    category: "Academics and Professional",
    description:
      "Present a comprehensive review of an industry, covering key trends, players, and future predictions",
    promptTemplate:
      "Conduct an in-depth examination of the ClimateTech industry, detailing its current market status, emerging trends, significant challenges, and opportunities. Make sure to include data and statistics, a list of major players, a forecast for the industry, and how current events or developments could influence it.",
    placeholder: "ClimateTech",
  },
  {
    name: "ScraperGPT",
    icon: <FaLaptopCode />,
    category: "Other",
    description: "Extract and summarize data from a selected website",
    promptTemplate:
      "Write a program to scrape the IMDb website and summarize the top 10 trending movies, including their ratings, director names, and a brief synopsis.",
    placeholder: "IMDb",
  },
  {
    name: "PostGPT",
    icon: <FaHashtag />,
    category: "Creative and Social",
    description: "Create engaging captions and hashtags for your social media posts",
    promptTemplate:
      "Create an engaging caption and appropriate hashtags for a social media post celebrating a fun-filled Summer Vacation at the beach.",
    placeholder: "Summer Vacation",
  },
  {
    name: "EmailGPT",
    icon: <FaRegEnvelope />,
    category: "Academics and Professional",
    description: "Compose a concise and detailed email",
    promptTemplate:
      "Compose a clear and succinct email to update the team about the progress of Project Alpha, discussing completed milestones, forthcoming tasks, and any challenges encountered.",
    placeholder: "Project Alpha",
  },
  {
    name: "ResumeGPT",
    icon: <FaFileAlt />,
    category: "Academics and Professional",
    description: "Design a professional resume based on your career history and skills",
    promptTemplate:
      "Develop a resume highlighting your skills and experiences in the Marketing field, paying particular attention to relevant projects, achievements, and any unique capabilities.",
    placeholder: "Marketing",
  },
  {
    name: "NovelGPT",
    icon: <FaBookOpen />,
    category: "Creative and Social",
    description: "Begin writing a novel in a selected genre",
    promptTemplate:
      "Begin writing a Fantasy novel set in a magical realm teeming with enchanting creatures, ancient prophecies, and epic quests.",
    placeholder: "Fantasy",
  },
  {
    name: "DietGPT",
    icon: <FaAppleAlt />,
    category: "Health and Fitness",
    description: "Create a customized diet plan based on dietary preferences and goals",
    promptTemplate:
      "Create a Vegetarian diet plan for a week aimed at promoting weight loss and overall health. Include a shopping list, meal suggestions, and simple recipes.",
    placeholder: "Vegetarian",
  },
  {
    name: "FitnessGPT",
    icon: <FaDumbbell />,
    category: "Health and Fitness",
    description: "Design a workout regimen tailored to your fitness goals",
    promptTemplate:
      "Develop a 4-week workout regimen for Weight Loss that includes a balanced mix of cardio, strength training, and flexibility exercises. Include rest days and provide safety precautions.",
    placeholder: "Weight Loss",
  },
  {
    name: "MarketingGPT",
    icon: <FaChartLine />,
    category: "Academics and Professional",
    description: "Design a comprehensive marketing strategy for your business",
    promptTemplate:
      "Develop a 6-month marketing plan for a Tech Startup. Include marketing objectives, target audience analysis, promotional strategies, budget allocation, timelines, and performance indicators.",
    placeholder: "Tech Startup",
  },
  {
    name: "BudgetGPT",
    icon: <FaMoneyBillWave />,
    category: "Academics and Professional",
    description: "Prepare a personal or family budget",
    promptTemplate:
      "Create a detailed budget for a Family Vacation to Europe, including expenses for flights, accommodation, meals, sightseeing, shopping, and any contingencies.",
    placeholder: "Family Vacation",
  },
  {
    name: "StudyGPT",
    icon: <FaGraduationCap />,
    category: "Academics and Professional",
    description: "Design a study schedule to achieve your academic objectives",
    promptTemplate:
      "Draft a study schedule for Final Exams, including study times, subjects to be covered each day, revision days, and breaks for rest and relaxation.",
    placeholder: "Final Exams",
  },
  {
    name: "NewsGPT",
    icon: <FaRegNewspaper />,
    category: "Other",
    description: "Author a detailed news article on a selected topic",
    promptTemplate:
      "Write a detailed news article discussing recent Technology Advancements, including their implications for society and the economy.",
    placeholder: "Technology Advancements",
  },
  {
    name: "EventPlannerGPT",
    icon: <FaCalendarAlt />,
    category: "Other",
    description: "Organize a detailed schedule for your forthcoming event",
    promptTemplate:
      "Plan a detailed schedule for a Music Festival, including artist line-ups, set times, venue arrangements, and contingency plans.",
    placeholder: "Music Festival",
  },
  {
    name: "BlogGPT",
    icon: <FaBlog />,
    category: "Creative and Social",
    description: "Write a blog post on a selected topic",
    promptTemplate:
      "Write an engaging blog post about Healthy Living, discussing nutrition, exercise, mental health, and practical tips for maintaining a healthy lifestyle.",
    placeholder: "Healthy Living",
  },
  {
    name: "AstroGPT",
    icon: <FaStarAndCrescent />,
    category: "Science and Technology",
    description: "Discuss astronomical phenomena, discoveries, and related technology",
    promptTemplate:
      "Delve into the latest discoveries about Black Holes. Cover their characteristics, theoretical underpinnings, related astronomical observations, and potential technological advancements driven by the research.",
    placeholder: "Black Holes",
  },
  {
    name: "ArtReviewGPT",
    icon: <FaPalette />,
    category: "Creative and Social",
    description: "Critique a piece of art, discussing its style, context, and influence",
    promptTemplate:
      "Provide a thoughtful critique of Vincent van Gogh's 'Starry Night'. Discuss its artistic style, historical context, symbolism, and influence on later art movements.",
    placeholder: "Starry Night",
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
