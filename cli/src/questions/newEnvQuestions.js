import { isValidKey, validKeyErrorMessage } from "../helpers.js";
import { RUN_OPTION_QUESTION } from "./sharedQuestions.js";
import fetch from "node-fetch";

export const newEnvQuestions = [
    RUN_OPTION_QUESTION,
    {
        type: "input",
        name: "OpenAIApiKey",
        message:
            "Enter your openai key (eg: sk...) or press enter to continue with no key:",
        validate: async(apikey) => {
            if(apikey === "") return true;

            if(!isValidKey(apikey, /^sk-[a-zA-Z0-9]{48}$/)) {
                return validKeyErrorMessage
            }

            const endpoint = "https://api.openai.com/v1/models"
            const response = await fetch(endpoint, {
                headers: {
                    "Authorization": `Bearer ${apikey}`,
                },
            });
            if(!response.ok) {
                return validKeyErrorMessage
            }

            return true
        },
    },
    {
        type: "input",
        name: "serpApiKey",
        message:
            "What is your SERP API key (https://serper.dev/)? Leave empty to disable web search.",
        validate: async(apikey) => {
            if(apikey === "") return true;

            if(!isValidKey(apikey, /^[a-zA-Z0-9]{40}$/)) {
                return validKeyErrorMessage
            }

            const endpoint = "https://google.serper.dev/search"
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    "X-API-KEY": apikey,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "q": "apple inc"
                }),
            });
            if(!response.ok) {
                return validKeyErrorMessage
            }

            return true
        },
    },
    {
        type: "input",
        name: "replicateApiKey",
        message:
            "What is your Replicate API key (https://replicate.com/)? Leave empty to just use DALL-E for image generation.",
        validate: async(apikey) => {
            if(apikey === "") return true;
            
            if(!isValidKey(apikey, /^r8_[a-zA-Z0-9]{37}$/)) {
                return validKeyErrorMessage
            }

            const endpoint = "https://api.replicate.com/v1/models/replicate/hello-world"
            const response = await fetch(endpoint, {
                headers: {
                    "Authorization": `Token ${apikey}`,
                },
            });
            if(!response.ok) {
                return validKeyErrorMessage
            }

            return true
        },
    },
    {
        type: "confirm",
        name: "useOllama",
        message: "Do you want to configure Ollama for local models?",
        default: false,
    },
    {
        type: "input",
        name: "ollamaApiBase",
        message: "Enter your Ollama API base URL (e.g., http://localhost:11434):",
        default: "http://localhost:11434",
        when: (answers) => answers.useOllama,
        validate: async (url) => {
            if (url === "") return "Ollama API base URL cannot be empty.";
            try {
                const response = await fetch(url); // Simple check to see if endpoint is reachable
                if (!response.ok && response.status !== 404 && response.status !== 200) {
                    // Ollama base path might return 404 or specific message, not necessarily an error for this check.
                    // A 200 is also fine if it serves something at base.
                    // We are mostly checking for network errors or complete unavailability.
                    // A more specific check would be to hit /api/tags if ollama API guarantees it
                    const text = await response.text();
                    if (text.toLowerCase().includes("ollama is running")) return true;
                    return `Could not connect to Ollama at ${url}. Status: ${response.status}`;
                }
                return true;
            } catch (error) {
                return `Error connecting to Ollama: ${error.message}. Please ensure Ollama is running and the URL is correct.`;
            }
        },
    },
];
