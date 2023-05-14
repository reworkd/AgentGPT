/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-var-requires */
require("dotenv").config();
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

const REGEX = /translate\(['"`](.*?)['"`](,\s*['"`](.*?)['"`])?\)/g;

const collectAndTranslate = async (
  dirPath,
  sourceLanguageCode,
  targetLanguageCode,
  translationService,
  translationMethod
) => {
  const files = fs.readdirSync(dirPath);
  files.forEach(async (file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory() && !filePath.includes("node_modules")) {
      await collectAndTranslate(
        filePath,
        sourceLanguageCode,
        targetLanguageCode,
        translationService,
        translationMethod
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
              console.log(translationKey + ": " + translations[translationKey]);
            }
            if (translationService == "openai") {
              const TRANSLATE_PROMPT = `Translate the \`${sourceTranslationValue}\` text using the \`${targetLanguageCode}\` language code then respond only with the translated text.`;
              if (translationMethod == "text") {
                translations[translationKey] = await translateViaTextCompletion(TRANSLATE_PROMPT);
              } else {
                translations[translationKey] = await translateViaChatCompletion(TRANSLATE_PROMPT);
              }
              console.log(translationKey + ": " + translations[translationKey]);
            }
            fs.writeFileSync(targetTranslationFile, JSON.stringify(translations, null, 2));
          }
        }
      }
    }
  });
};

const onlyCollect = async (dirPath) => {
  const files = fs.readdirSync(dirPath);
  files.forEach(async (file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory() && !filePath.includes("node_modules")) {
      await onlyCollect(filePath);
    } else {
      const extname = path.extname(filePath);
      if (extname === ".ts" || extname === ".tsx" || extname === ".js" || extname === ".jsx") {
        const content = fs.readFileSync(filePath, "utf-8");
        const regex = REGEX;
        let match;
        while ((match = regex.exec(content)) !== null) {
          const translationKey = match[1];
          const namespace = match[3] || "common";
          const targetTranslationFile = path.join(TRANSLATION_DIR, `${namespace}.json`);
          let translations = {};
          if (fs.existsSync(targetTranslationFile)) {
            translations = JSON.parse(fs.readFileSync(targetTranslationFile, "utf-8"));
          }
          if (!translations[translationKey]) {
            translations[translationKey] = translationKey;
            fs.writeFileSync(targetTranslationFile, JSON.stringify(translations, null, 2));
            console.log(translationKey + " added to " + targetTranslationFile);
          }
        }
      }
    }
  });
};

const onlyTranslate = async (dirPath, sourceLanguage, targetLanguage) => {};

const { ArgumentParser } = require("argparse");
const parser = new ArgumentParser();
parser.add_argument("-s", "--sourceLanguage", {
  help: "source language code",
  default: process.env.TRANSLATION_SOURCE_LANGUAGE || "",
});
parser.add_argument("-t", "--targetLanguage", { help: "target language code" });
parser.add_argument("-service", "--translation-service", {
  help: "translation service (e.g., google, openai)",
  default: process.env.TRANSLATION_SERVICE || "google",
});
parser.add_argument("-method", "--translation-method", {
  help: "translation method (e.g., chat, machine)",
  default: process.env.TRANSLATION_METHOD || "chat",
});
const args = parser.parse_args();

const sourceLanguageCode = args.source;
const targetLanguageCode = args.target;
const translationService = args.translation_service;
const translationMethod = args.translation_method;

const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(
  "Select a mode (e.g., CollectAndTranslate (default), OnlyCollect, OnlyTranslate): ",
  async (mode) => {
    if (mode === "CollectAndTranslate") {
      CollectAndTranslateInformationGathering();
    } else if (mode === "OnlyCollect") {
      await startOnlyCollect();
      rl.close();
    } else if (mode === "OnlyTranslate") {
    } else {
      CollectAndTranslateInformationGathering();
    }
  }
);

function CollectAndTranslateInformationGathering() {
  rl.question(
    "Enter the source language's code (Default: en): ",
    (sourceLanguageCode = sourceLanguageCode) => {
      rl.question(
        "Enter the target language's code (e.g., fr): ",
        (targetLanguageCode = targetLanguageCode) => {
          if (!fs.existsSync(TRANSLATION_DIR)) {
            fs.mkdirSync(TRANSLATION_DIR, { recursive: true });
          }
          rl.question(
            "Choose a translation service (e.g., google (default), openai): ",
            async (service) => {
              if (service === "openai" && process.env.OPENAI_API_KEY === "") {
                return "Please set the OPENAI_API_KEY environment variable to run this script";
              } else if (service === "openai") {
                rl.question("Choose a method (e.g., chat (default), text): ", async (method) => {
                  await startCollectAndTranslate(
                    sourceLanguageCode,
                    targetLanguageCode,
                    service,
                    method
                  );
                  rl.close();
                });
              } else {
                await startCollectAndTranslate(
                  sourceLanguageCode,
                  targetLanguageCode,
                  service,
                  (method = null)
                );
                rl.close();
              }
            }
          );
        }
      );
    }
  );
}

async function startCollectAndTranslate(sourceLanguageCode, targetLanguageCode, service, method) {
  await collectAndTranslate(
    ROOT_DIR,
    sourceLanguageCode,
    targetLanguageCode,
    service || translationService,
    method || translationMethod
  );
}

async function startOnlyCollect() {
  if (!fs.existsSync(TRANSLATION_DIR)) {
    fs.mkdirSync(TRANSLATION_DIR, { recursive: true });
  }
  await onlyCollect(ROOT_DIR);
}

async function startOnlyTranslate(sourceLanguageCode, targetLanguageCode, service, method) {
  await onlyTranslate(
    sourceLanguageCode,
    targetLanguageCode,
    service || translationService,
    method || translationMethod
  );
}

const GoogleTranslate = async (sourceLanguageCode, targetLanguageCode, sourceTranslationValue) => {
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
};

const translateViaChatCompletion = async (TRANSLATE_PROMPT) => {
  const translationResult = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 1,
    messages: [{ role: "user", content: TRANSLATE_PROMPT }],
  });
  return translationResult.data.choices[0].message.content.replace(/^['",`]+|['",`]+$/g, "");
};

const translateViaTextCompletion = async (TRANSLATE_PROMPT) => {
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
};
