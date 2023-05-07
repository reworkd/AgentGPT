// Import the createModel function
import { GPT_35_TURBO } from "../src/utils/constants";
import { createModel } from "../src/utils/prompts";

describe("createModel", () => {
  test("should use custom settings when API key is provided", () => {
    const customSettings = {
      customApiKey: "test_api_key",
      customTemperature: 0.222,
      customModelName: "Custom_Model",
      maxTokens: 1234,
    };

    const model = createModel(customSettings);

    expect(model.temperature).toBe(customSettings.customTemperature);
    expect(model.modelName).toBe(customSettings.customModelName);
    expect(model.maxTokens).toBe(customSettings.maxTokens);
  });

  test("should use default settings when API key is not provided", () => {
    const customSettings = {
      customTemperature: 0.222,
      customModelName: "Custom_Model",
      maxTokens: 1234,
    };

    const model = createModel(customSettings);

    expect(model.temperature).toBe(0.9);
    expect(model.modelName).toBe(GPT_35_TURBO);
    expect(model.maxTokens).toBe(400);
  });
});
