export const TEMPLATE_DATA: TemplateModel[] = [
  {
    name: "PlatformerGPT  🎮",
    category: "Games",
    description: "Write some code to make a platformer game.",
    promptTemplate: "Write some code to make a platformer game about 'Mario'.",
    placeholder: "Mario",
  },
  {
    name: "ResearchGPT  📜",
    category: "Academics",
    description: "Create a comprehensive report of a topic of your choice",
    promptTemplate: "Create a comprehensive report of 'Global Warming'.",
    placeholder: "Global Warming",
  },
  {
    name: "TravelGPT  🌴",
    category: "Travel",
    description: "Plan a detailed trip to destination",
    promptTemplate: "Plan a detailed trip to 'Paris'.",
    placeholder: "Paris",
  },
  {
    name: "ScraperGPT  ⚒️",
    category: "Web",
    description: "Scrap a website of your choice",
    promptTemplate: "Scrap 'IMDb' website and summarize the details",
    placeholder: "IMDb",
  },
  {
    name: "PostGPT  📮",
    category: "Social Media",
    description: "Thinks of captions and hashtags for your social media posts",
    promptTemplate:
      "Create a caption and hashtags for a social media post about 'Summer Vacation'.",
    placeholder: "Summer Vacation",
  },
  {
    name: "EmailGPT  📧",
    category: "Communications",
    description: "Compose a concise and detailed email",
    promptTemplate: "Compose a concise email about 'Project Update'.",
    placeholder: "Project Update",
  },
  {
    name: "ResumeGPT  📝",
    category: "Career",
    description: "Create a professional resume based on your career history.",
    promptTemplate: "Create a resume detailing your experience in 'Marketing'.",
    placeholder: "Marketing",
  },
  {
    name: "NovelGPT  📚",
    category: "Creative Writing",
    description: "Start writing a novel in your chosen genre.",
    promptTemplate: "Start writing a 'Fantasy' genre novel",
    placeholder: "Fantasy",
  },
  {
    name: "DietGPT  🥗",
    category: "Health & Wellness",
    description: "Plan a personalized diet based on your dietary preferences.",
    promptTemplate: "Plan a 'Vegetarian' diet",
    placeholder: "Vegetarian",
  },
  {
    name: "FitnessGPT  🏋️",
    category: "Health & Wellness",
    description: "Design a workout regimen based on your fitness goals.",
    promptTemplate: "Design a workout regimen for 'Weight Loss'.",
    placeholder: "Weight Loss",
  },
  {
    name: "MarketingGPT  📈",
    category: "Business",
    description: "Create a comprehensive marketing plan for your business.",
    promptTemplate: "Create a comprehensive marketing plan for 'Startup'.",
    placeholder: "Startup",
  },
  {
    name: "BudgetGPT  💰",
    category: "Personal Finance",
    description: "Prepare a personal or family budget plan.",
    promptTemplate: "Prepare a budget for 'Family Vacation'.",
    placeholder: "Family Vacation",
  },
  {
    name: "StudyGPT  📖",
    category: "Academics",
    description: "Create a study schedule based on your academic goals.",
    promptTemplate: "Create a study schedule for 'Final Exams'.",
    placeholder: "Final Exams",
  },
  {
    name: "NewsGPT  📰",
    category: "News & Media",
    description: "Write a detailed news article on a topic of your choice.",
    promptTemplate: "Write a news article on 'Technology Advancements'.",
    placeholder: "Technology Advancements",
  },
  {
    name: "EventPlannerGPT  🎉",
    category: "Event Planning",
    description: "Plan a detailed schedule for your upcoming event.",
    promptTemplate: "Plan a detailed schedule for 'Music Festival' event",
    placeholder: "Music Festival",
  },
  {
    name: "BlogGPT  📝",
    category: "Blogging",
    description: "Compose a blog post on a topic of your choice.",
    promptTemplate: "Compose a blog post about 'Healthy Living'.",
    placeholder: "Healthy Living",
  },
];

export interface TemplateModel {
  name: string;
  category: string;
  description: string;
  promptTemplate: string;
  placeholder: string;
}
