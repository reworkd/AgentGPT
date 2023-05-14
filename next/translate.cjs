/* eslint-disable @typescript-eslint/no-var-requires */
require("dotenv").config();
const $ = require("jquery");
const path = require("path");
const fs = require("fs");
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const ROOT_DIR = __dirname;
const LOCALES_DIR = path.join(ROOT_DIR, "public", "locales");
const TRANSLATION_DIR = path.join(ROOT_DIR, "public", "locales", "translation");

const TRANSLATION_SERVICE = process.env.TRANSLATION_SERVICE || "google";
const TANSLATION_METHOD = process.env.TANSLATION_METHOD || "chat";

const REGEX = /translate\(['"`](.*?)['"`](,\s*['"`](.*?)['"`])?\)/g;

const collectAndTranslate = async (
  dirPath,
  sourceLanguageCode = "en",
  targetLanguageCode,
  translationService
) => {
  const files = fs.readdirSync(dirPath);
  files.forEach(async (file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory() && !filePath.includes("node_modules")) {
      await collectAndTranslate(
        filePath,
        sourceLanguageCode,
        targetLanguageCode,
        translationService
      );
    } else {
      const extname = path.extname(filePath);
      if (extname === ".ts" || extname === ".tsx" || extname === ".js" || extname === ".jsx") {
        const content = fs.readFileSync(filePath, "utf-8");
        const regex = REGEX;
        let match;
        while ((match = regex.exec(content)) !== null) {
          const translationKey = match[1];
          const namespace = match[3] || "common";
          const sourceTranslationFile = path.join(
            LOCALES_DIR,
            `${sourceLanguageCode}`,
            `${namespace}.json`
          );
          const targetTranslationFile = path.join(TRANSLATION_DIR, `${namespace}.json`);
          let translations = {};
          if (fs.existsSync(targetTranslationFile)) {
            translations = JSON.parse(fs.readFileSync(targetTranslationFile, "utf-8"));
          }
          if (!translations[translationKey]) {
            const sourceTranslations = JSON.parse(fs.readFileSync(sourceTranslationFile, "utf-8"));
            const sourceTranslationValue = sourceTranslations[translationKey];
            if (translationService == "google") {
              const translatedValue = await GoogleTranslate(
                sourceLanguageCode,
                targetLanguageCode,
                sourceTranslationValue
              );
              translations[translationKey] = translatedValue;
              console.log(translations[translationKey]);
            }
            if (translationService == "openai") {
              const TRANSLATE_PROMPT = `Translate the \`${sourceTranslationValue}\` text using the \`${targetLanguageCode}\` language code then respond only with the translated text.`;
              if (TANSLATION_METHOD === "text") {
                translations[translationKey] = await translateViaTextCompletion(TRANSLATE_PROMPT);
              } else {
                translations[translationKey] = await translateViaChatCompletion(TRANSLATE_PROMPT);
              }
              console.log(translations[translationKey]);
            }
            fs.writeFileSync(targetTranslationFile, JSON.stringify(translations, null, 2));
          }
        }
      }
    }
  });
};

async function GoogleTranslate(sourceLanguageCode, targetLanguageCode, sourceTranslationValue) {
  const params = new URLSearchParams({
    client: "gtx",
    sl: sourceLanguageCode,
    tl: targetLanguageCode,
    dt: "t",
    q: sourceTranslationValue,
  }).toString();

  const url = `https://translate.google.com/translate_a/single?${params}`;

  const translationResult = await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const translatedText = data[0][0][0];
      return translatedText;
    })
    .catch((error) => console.log(error));

  return translationResult;
}

async function translateViaChatCompletion(TRANSLATE_PROMPT) {
  const translationResult = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 1,
    messages: [{ role: "user", content: TRANSLATE_PROMPT }],
  });
  return translationResult.data.choices[0].message.content.replace(/^['",`]+|['",`]+$/g, "");
}

async function translateViaTextCompletion(TRANSLATE_PROMPT) {
  const translationResult = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: TRANSLATE_PROMPT,
    temperature: 0.7,
    max_tokens: 100,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  return translationResult.data.choices[0].text.split("\n\n")[1].replace(/^['",`]+|['",`]+$/g, "");
}

const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
rl.question("Enter the source language code (Default: en): ", (sourceLanguageCode) => {
  rl.question("Enter the target language code (e.g., fr): ", async (targetLanguageCode) => {
    rl.question(
      "Choose a translation service (e.g., google, openai (Default: google)): ",
      async (service) => {
        if (service === "openai" && process.env.OPENAI_API_KEY === "") {
          return "Please set the OPENAI_API_KEY environment variable to run this script";
        }
        if (!fs.existsSync(TRANSLATION_DIR)) {
          fs.mkdirSync(TRANSLATION_DIR, { recursive: true });
        }
        await collectAndTranslate(
          ROOT_DIR,
          sourceLanguageCode,
          targetLanguageCode,
          service || TRANSLATION_SERVICE
        );
        rl.close();
      }
    );
  });
});
