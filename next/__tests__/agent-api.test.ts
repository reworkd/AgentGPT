import "../__mocks__/matchMedia.mock"
import { AgentApi, withRetries } from "../src/services/agent/agent-api";
import type {ApiModelSettings} from "../src/utils/interfaces";

describe("withRetries", () => {
  let instance: AgentApi;
  const modelSettings: ApiModelSettings = {
    language: "", max_tokens: 0, model: "gpt-4", temperature: 0

  }

  beforeEach( () => {
    instance = new AgentApi({goal: "", model_settings: modelSettings})
  })

  it("should retry 3 times by default", async () => {
    let nbTries = 0;

    await withRetries(
      (): Promise<void> => {
        ++nbTries;
        throw new Error()
      },
      (): Promise<boolean> => {
        return Promise.resolve(true)
      },
    )

    expect(nbTries).toEqual(4)
  });

  it("should retry nbRetries times on error", async () => {
    const nbRetries = 5;
    let nbTries = 0;

    await withRetries(
      (): Promise<void> => {
        ++nbTries;
        throw new Error()
      },
      (): Promise<boolean> => {
        return Promise.resolve(true)
      },
      nbRetries
    )

    expect(nbTries).toEqual(nbRetries+1)
  });

  it("should not retry", async () => {
    const nbRetries = 0;
    let nbTries = 0;

    await withRetries(
      (): Promise<void> => {
        ++nbTries;
        throw new Error()
      },
      (): Promise<boolean> => {
        return Promise.resolve(true)
      },
      nbRetries
    )

    expect(nbTries).toEqual(1)
  });

  it("should stop on error", async () => {
    const nbRetries = 3;
    let nbTries = 0;

    await withRetries(
      (): Promise<void> => {
        ++nbTries;
        throw new Error()
      },
      (): Promise<boolean> => {
        return Promise.resolve(false)
      },
      nbRetries
    )

    expect(nbTries).toEqual(1)
  });
});
