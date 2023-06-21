import type { Message } from "../src/types/message";
import { MessageService } from "../src/services/agent/message-service";

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
      type: "error",
      value: "ERROR_API_KEY_QUOTA",
    });
  });

  it("should handle platform errors", () => {
    const axiosError = {
      isAxiosError: true,
      response: {
        status: 409,
        data: {
          error: "OpenAIError",
          detail: "You have exceeded the maximum number of requests allowed for your API key.",
          code: 429,
        },
      },
    };

    instance.sendErrorMessage(axiosError);
    expect(renderMessage).toHaveBeenCalledWith({
      type: "error",
      value: axiosError.response.data.detail,
    });
  });

  it("should handle unknown platform errors", () => {
    const axiosError = {
      isAxiosError: true,
      response: { status: 409 },
    };

    instance.sendErrorMessage(axiosError);
    expect(renderMessage).toHaveBeenCalledWith({
      type: "error",
      value: "An Unknown Error Occurred, Please Try Again!",
    });
  });

  it("should handle non-Axios string errors", () => {
    const error = "An error occurred";

    instance.sendErrorMessage(error);
    expect(renderMessage).toHaveBeenCalledWith({
      type: "error",
      value: error,
    });
  });

  it("should handle unknown errors", () => {
    instance.sendErrorMessage({});
    expect(renderMessage).toHaveBeenCalledWith({
      type: "error",
      value: "An unknown error occurred. Please try again later.",
    });
  });
});
