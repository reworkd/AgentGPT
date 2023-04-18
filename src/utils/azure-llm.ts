// https://gist.github.com/aaronrogers/b6bb28e0e2299e5b96b168e8607a1cc2

import { BaseLLM } from 'langchain/llms/base'
import { CallbackManager } from 'langchain/callbacks'
import { LLMResult } from 'langchain/schema'
import type { TiktokenModel } from '@dqbd/tiktoken'

export class AzureLLM extends BaseLLM {
  name = 'AzureLLM'
  batchSize = 20
  temperature: number
  modelName: string
  concurrency?: number
  key: string
  endpoint: string
  maxTokens: number

  constructor(fields?: {
    callbackManager?: CallbackManager
    concurrency?: number
    cache?: boolean
    verbose?: boolean
    temperature?: number
    modelName?: string
    key?: string
    endpoint?: string
    maxTokens?: number
  }) {
    super({ ...fields })
    this.temperature = fields?.temperature === undefined ? 0.7 : fields?.temperature

    const apiKey = process.env.OPENAI_API_KEY || fields?.key
    if (!apiKey) {
      throw new Error('Azure key not provided. Either set OPENAI_API_KEY in your .env file or pass it in as a field to the constructor.')
    }
    this.key = apiKey

    const endpoint = process.env.AZURE_LLM_ENDPOINT || fields?.endpoint
    if (!endpoint) {
      throw new Error(
        'Azure endpoint not provided. Either set AZURE_LLM_ENDPOINT in your .env file or pass it in as a field to the constructor.'
      )
    }
    this.endpoint = endpoint

    const modelName = process.env.AZURE_LLM_MODEL || fields?.modelName
    if (!modelName) {
      throw new Error(
        'Azure model name not provided. Either set AZURE_LLM_MODEL in your .env file or pass it in as a field to the constructor.'
      )
    }
    this.modelName = modelName

    this.maxTokens = fields?.maxTokens || 1000
  }

  async _generate(prompts: string[], stop?: string[] | undefined): Promise<LLMResult> {
    const subPrompts = chunkArray(prompts, this.batchSize)
    const choices: Choice[] = []
    
    for (let i = 0; i < subPrompts.length; i += 1) {
      const prompts = subPrompts[i] as string[]
      const args = promptToAzureArgs({ prompt: prompts, temperature: this.temperature, stop, maxTokens: this.maxTokens })
      const data = await this._callAzure(args)
      choices.push(...data.choices)
    }

    // *sigh* I have 1 for chunks just so it'll work like the example code
    const generations = chunkArray(choices, 1).map((promptChoices) =>
      promptChoices.map((choice) => ({
        text: choice.text ?? '',
        generationInfo: {
          finishReason: choice.finish_reason,
          logprobs: choice.logprobs,
        },
      }))
    )

    return {
      generations,
    }
  }

  private async _callAzure(args: LLMPromptArgs): Promise<LLMResponse> {
    const headers = { 'Content-Type': 'application/json', 'api-key': this.key }

    const response = await fetch(`${this.endpoint}openai/deployments/${this.modelName}/completions?api-version=2023-03-15-preview`, {
      method: 'POST',
      headers,
      body: JSON.stringify(args),
    })

    if (!response.ok) {
      const text = await response.text()
      console.error('Azure request failed', text)
      throw new Error(`Azure request failed with status ${response.status}`)
    }

    const json = await response.json()

    return json
  }

  _llmType(): string {
    return this.name
  }
}

const promptToAzureArgs = ({
  prompt,
  temperature,
  stop,
  maxTokens,
}: {
  prompt: string[]
  temperature: number
  stop: string[] | string | undefined
  maxTokens: number
}): LLMPromptArgs => {
  return {
    prompt,
    temperature,
    max_tokens: maxTokens,
    stop,
  }
}
      
// From Langchain

type LLMPromptArgs = {
  prompt: string[] | string
  max_tokens?: number
  temperature?: number
  top_p?: number
  n?: number
  stream?: boolean
  logprobs?: number
  frequency_penalty?: number
  presence_penalty?: number
  stop?: string[] | string
  best_of?: number
  logit_bias?: unknown
}

type Choice = {
  text: string
  index: number
  logprobs: unknown
  finish_reason: string
}

type LLMResponse = {
  id: string
  object: string
  created: number
  model: string
  choices: Choice[]
}

const chunkArray = <T>(arr: T[], chunkSize: number) =>
  arr.reduce((chunks, elem, index) => {
    const chunkIndex = Math.floor(index / chunkSize)
    const chunk = chunks[chunkIndex] || []
    // eslint-disable-next-line no-param-reassign
    chunks[chunkIndex] = chunk.concat([elem])
    return chunks
  }, [] as T[][])

// From: https://github.com/hwchase17/langchainjs/blob/main/langchain/src/llms/calculateMaxTokens.ts

const getModelContextSize = (modelName: TiktokenModel): number => {
  switch (modelName) {
    case 'text-davinci-003':
      return 4097
    case 'text-curie-001':
      return 2048
    case 'text-babbage-001':
      return 2048
    case 'text-ada-001':
      return 2048
    case 'code-davinci-002':
      return 8000
    case 'code-cushman-001':
      return 2048
    default:
      return 4097
  }
}

type CalculateMaxTokenProps = {
  prompt: string
  modelName: TiktokenModel
}
