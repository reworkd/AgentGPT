import { Tool } from "langchain/tools";
import type { ModelSettings } from "../../utils/types";
import { LLMChain } from "langchain/chains";
import { createModel, summarizeSearchSnippets } from "../../utils/prompts";

/**
 * Wrapper around Serper adapted from LangChain: https://github.com/hwchase17/langchainjs/blob/main/langchain/src/tools/serper.ts
 *
 * You can create a free API key at https://serper.dev.
 *
 * To use, you should have the SERP_API_KEY environment variable set.
 */
export class Serper extends Tool {
  // Required values for Tool
  name = "search";
  description =
    "A search engine that should be used sparingly and only for questions about current events. Input should be a search query.";

  protected key: string;
  protected modelSettings: ModelSettings;
  protected goal: string;

  constructor(modelSettings: ModelSettings, goal: string) {
    super();

    this.key = process.env.SERP_API_KEY ?? "";
    this.modelSettings = modelSettings;
    this.goal = goal;
    if (!this.key) {
      throw new Error(
        "Serper API key not set. You can set it as SERPER_API_KEY in your .env file, or pass it to Serper."
      );
    }
  }

  /** @ignore */
  async _call(input: string) {
    const res = await this.callSerper(input);
    const searchResult: SearchResult = (await res.json()) as SearchResult;

    // Link means it is a snippet from a website and should not be viewed as a final answer
    if (searchResult.answerBox && !searchResult.answerBox.link) {
      const answerValues: string[] = [];
      if (searchResult.answerBox.title) {
        answerValues.push(searchResult.answerBox.title);
      }

      if (searchResult.answerBox.answer) {
        answerValues.push(searchResult.answerBox.answer);
      }

      if (searchResult.answerBox.snippet) {
        answerValues.push(searchResult.answerBox.snippet);
      }

      return answerValues.join("\n");
    }

    if (searchResult.sportsResults?.game_spotlight) {
      return searchResult.sportsResults.game_spotlight;
    }

    if (searchResult.knowledgeGraph?.description) {
      // TODO: use Title description, attributes
      return searchResult.knowledgeGraph.description;
    }

    if (searchResult.organic?.[0]?.snippet) {
      const snippets = searchResult.organic.map((result) => result.snippet);
      const summary = await summarizeSnippets(
        this.modelSettings,
        this.goal,
        input,
        snippets
      );
      const resultsToLink = searchResult.organic.slice(0, 3);
      const links = resultsToLink.map((result) => result.link);

      return `${summary}\n\nLinks:\n${links
        .map((link) => `- ${link}`)
        .join("\n")}`;
    }

    return "No good search result found";
  }

  async callSerper(input: string) {
    const options = {
      method: "POST",
      headers: {
        "X-API-KEY": this.key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: input,
      }),
    };

    const res = await fetch("https://google.serper.dev/search", options);

    if (!res.ok) {
      console.error(`Got ${res.status} error from serper: ${res.statusText}`);
    }

    return res;
  }
}

interface SearchResult {
  answerBox?: AnswerBox;
  knowledgeGraph?: KnowledgeGraph;
  organic?: OrganicResult[];
  relatedSearches?: RelatedSearch[];
  sportsResults?: SportsResults;
}

interface AnswerBox {
  title?: string;
  answer?: string;
  snippet?: string;
  link?: string;
}

interface SportsResults {
  game_spotlight: string;
}

interface KnowledgeGraph {
  title: string;
  type: string;
  imageUrl: string;
  description: string;
  descriptionLink: string;
  attributes: object;
}

interface OrganicResult {
  title: string;
  link: string;
  snippet: string;
  attributes?: object;
}

interface RelatedSearch {
  query: string;
}

const summarizeSnippets = async (
  modelSettings: ModelSettings,
  goal: string,
  query: string,
  snippets: string[]
) => {
  const completion = await new LLMChain({
    llm: createModel(modelSettings),
    prompt: summarizeSearchSnippets,
  }).call({
    goal,
    query,
    snippets,
  });
  return completion.text as string;
};
