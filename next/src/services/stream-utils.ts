import { env } from "../env/client.mjs";
import type { RequestBody } from "../utils/interfaces";

type TextStream = ReadableStreamDefaultReader<Uint8Array>;

const fetchData = async (url: string, body: RequestBody): Promise<TextStream | undefined> => {
  url = env.NEXT_PUBLIC_BACKEND_URL + url;
  const response = await fetch(url, {
    method: "POST",
    cache: "no-cache",
    keepalive: true,
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify(body),
  });

  return response.body?.getReader();
};

async function readStream(reader: TextStream): Promise<string | null> {
  const result = await reader.read();
  return result.done ? null : new TextDecoder().decode(result.value);
}

async function processStream(
  reader: TextStream,
  onStart: () => void,
  onText: (text: string) => void,
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
    console.error(error);
  }
}

export const streamText = async (
  url: string,
  body: RequestBody,
  onStart: () => void,
  onText: (text: string) => void,
  shouldClose: () => boolean
) => {
  const reader = await fetchData(url, body);
  if (!reader) {
    console.error("Reader is undefined!");
    return;
  }

  await processStream(reader, onStart, onText, shouldClose);
};
