/* eslint-disable @typescript-eslint/no-var-requires */
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

class Translator {
  constructor(srcLang, targetLang) {
    this.srcLang = srcLang;
    this.targetLang = targetLang;
    this.keyValuePairs = [];
    this.keyNamespacePairs = [];
    this.manualMode = false;
    this.translatorService = transService || process.env.TRANSLATOR_SERVICE || "google";
  }

  collectKeyNamespacePairs(directory) {
    const files = fs.readdirSync(directory);

    files.forEach((file) => {
      const filePath = path.join(directory, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        this.collectKeyNamespacePairs(filePath); // Recursively process subdirectories
      } else if (stats.isFile() && (file.endsWith(".ts") || file.endsWith(".tsx"))) {
        this.extractKeyNamespacePairs(filePath);
      }
    });
  }

  extractKeyNamespacePairs(filePath) {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const regex = /translate\("([^"]+)"(?:, "([^"]+)")?\)/g;
    let match;

    while ((match = regex.exec(fileContent)) !== null) {
      const key = match[1];
      const namespace = match[2] ? match[2].replace(/"/g, "") : "common";

      this.keyNamespacePairs.push({ key, namespace });
    }
  }

  async translateAndWriteFiles() {
    const translationDir = path.join(__dirname, "public", "locales", "translation");

    if (fs.existsSync(translationDir)) {
      fs.rmdirSync(translationDir, { recursive: true, force: true });
    }

    fs.mkdirSync(translationDir);

    await Promise.all(
      this.keyNamespacePairs.map(async ({ key, namespace }) => {
        const srcLangFilePath = path.join(
          __dirname,
          "public",
          "locales",
          this.srcLang,
          `${namespace}.json`
        );
        const targetLangFilePath = path.join(translationDir, `${namespace}.json`);

        const sourceTranslationValue = this.getTranslationValue(srcLangFilePath, key);
        if (sourceTranslationValue !== "") {
          const translatedValue = await this.translateText(sourceTranslationValue);
          this.writeTranslationFile(targetLangFilePath, key, translatedValue);
        } else {
          if (this.manualMode) {
            rl.question(
              `Would you like to manually enter the translation for the key ${key} on ${this.targetLang} language?`,
              (answer) => {
                if (answer === "yes" || answer === "y") {
                  rl.question(
                    `Enter the translation for the key "${key}": `,
                    (enteredTranslation) => {
                      this.writeTranslationFile(targetLangFilePath, key, enteredTranslation);
                      rl.close();
                    }
                  );
                } else {
                  this.writeTranslationFile(targetLangFilePath, key, null);
                  rl.close();
                }
              }
            );
          } else {
            this.writeTranslationFile(targetLangFilePath, key, null);
          }
        }
      })
    );
  }

  getTranslationValue(filePath, key) {
    const content = fs.readFileSync(filePath, "utf8");
    const translations = JSON.parse(content);
    return translations[key] || "";
  }

  async translateText(sourceTranslationValue) {
    const targetTranslationValue = await GoogleTranslate(
      this.srcLang,
      this.targetLang,
      sourceTranslationValue
    );
    return targetTranslationValue;
  }

  writeTranslationFile(filePath, key, translatedValue) {
    const translation = { [key]: translatedValue };

    if (fs.existsSync(filePath)) {
      const existingContent = fs.readFileSync(filePath, "utf8");
      let existingTranslations = {};

      try {
        existingTranslations = JSON.parse(existingContent);
      } catch (error) {
        console.error(`Error parsing existing translations file: ${filePath}`);
      }

      const mergedTranslations = { ...existingTranslations, ...translation };

      const sortedTranslations = Object.keys(mergedTranslations)
        .sort()
        .reduce((sortedObj, sortedKey) => {
          sortedObj[sortedKey] = mergedTranslations[sortedKey];
          return sortedObj;
        }, {});

      const mergedContent = JSON.stringify(sortedTranslations, null, 2);

      fs.writeFileSync(filePath, mergedContent, "utf8");
    } else {
      const content = JSON.stringify(translation, null, 2);
      fs.writeFileSync(filePath, content, "utf8");
    }
  }

  async run(srcDirectory) {
    this.collectKeyNamespacePairs(srcDirectory);
    await this.translateAndWriteFiles();

    console.log("Translation files generated successfully.");
  }
}

const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter source language code: ", (srcLang) => {
  srcLang === "" ? (srcLang = "en") : (srcLang = srcLang);
  rl.question("Enter target language code: ", (targetLang) => {
    targetLang === ""
      ? (targetLang = process.env.DEFAULT_TARGET_LANGUAGE || "hu")
      : (targetLang = targetLang);
    const translator = new Translator(srcLang, targetLang);
    translator.run("src");
    rl.close();
  });
});

// Services
// GoogleTranslate
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

  return translationResult !== undefined ? translationResult.replace(/^['"`]+|['"`]+$/g, "") : "";
};

// OpenAI
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
