import { env } from "../env/client.mjs";
import type { RequestBody } from "../utils/interfaces";

type TextStream = ReadableStreamDefaultReader<Uint8Array>;

const fetchData = async (
  url: string,
  body: RequestBody,
  accessToken: string,
  onError: (message: unknown) => void
): Promise<TextStream | undefined> => {
  url = env.NEXT_PUBLIC_BACKEND_URL + url;

  try {
    const response = await fetch(url, {
      method: "POST",
      cache: "no-cache",
      keepalive: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    if (response.status === 409) {
      // TODO: Return the entire object
      const error = (await response.json()) as { error: string; detail: string };
      onError(error.detail);
    }

    return response.body?.getReader();
  } catch (error) {
    onError(error);
  }
};

async function readStream(reader: TextStream): Promise<string | null> {
  const result = await reader.read();
  return result.done ? null : new TextDecoder().decode(result.value);
}

async function processStream(
  reader: TextStream,
  onStart: () => void,
  onText: (text: string) => void,
  onError: (error: unknown) => void,
  shouldClose: () => boolean
): Promise<void> {
  try {
    onStart();
    while (true) {
      if (shouldClose()) {
        await reader.cancel();
        return;
      }

      const text = await readStream(reader);
      if (text === null) break;
      onText(text);
    }
  } catch (error) {
    onError(error);
  }
}

export const streamText = async (
  url: string,
  body: RequestBody,
  accessToken: string,
  onStart: () => void,
  onText: (text: string) => void,
  onError: (error: unknown) => void,
  shouldClose: () => boolean
) => {
  const reader = await fetchData(url, body, accessToken, onError);
  if (!reader) {
    console.error("Reader is undefined!");
    return;
  }

  await processStream(reader, onStart, onText, onError, shouldClose);
};
