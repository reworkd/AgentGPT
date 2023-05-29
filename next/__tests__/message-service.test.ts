import MessageService from "../src/services/agent/message-service";
import type { Message } from "../src/types/agentTypes";

describe("sendErrorMessage", () => {
  let instance: MessageService;
  let renderMessage: jest.Mock;

  beforeEach(() => {
    renderMessage = jest.fn((message: Message) => ({}));
    instance = new MessageService(renderMessage);
    instance.setIsRunning(true);
  });

  it("should handle Axios errors", () => {
    const axiosError = {
      isAxiosError: true,
      response: { status: 429 },
    };

    instance.sendErrorMessage(axiosError);
    expect(renderMessage).toHaveBeenCalledWith({
      type: "system",
      value: "ERROR_ACCESSING_OPENAI_API_KEY",
    });
  });

  it("should handle non-Axios string errors", () => {
    const error = "An error occurred";

    instance.sendErrorMessage(error);
    expect(renderMessage).toHaveBeenCalledWith({
      type: "system",
      value: error,
    });
  });

  it("should handle unknown errors", () => {
    instance.sendErrorMessage({});
    expect(renderMessage).toHaveBeenCalledWith({
      type: "system",
      value: "ERROR_RETRIEVE_INITIAL_TASKS",
    });
  });
});
