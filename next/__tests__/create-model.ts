// Import the createModel function
import { createModel } from "../src/utils/prompts";

describe("createModel", () => {
  test("should use custom settings when API key is provided", () => {
    const customSettings = {
      customTemperature: 0.222,
      customModelName: "Custom_Model",
      maxTokens: 1234,
    };

    const model = createModel(customSettings);

    expect(model.temperature).toBe(customSettings.customTemperature);
    expect(model.modelName).toBe(customSettings.customModelName);
    expect(model.maxTokens).toBe(customSettings.maxTokens);
  });
});
