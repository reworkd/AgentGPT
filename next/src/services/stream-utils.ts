import { env } from "../env/client.mjs";
import type { RequestBody } from "../utils/interfaces";

const fetchData = async (url: string, body: RequestBody) => {
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

async function processStream(
  reader: ReadableStreamDefaultReader<Uint8Array> | undefined,
  callback: (text: string) => void
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      if (reader) {
        while (true) {
          const result = await reader.read();
          if (result.done) {
            console.log("Stream closed");
            resolve();
            break;
          }
          const text = new TextDecoder().decode(result.value);
          callback(text);
        }
      }
    } catch (error) {
      reject(error);
    }
  });
}

export const streamText = async (
  url: string,
  body: RequestBody,
  callback: (text: string) => void
) => {
  console.log("StreamText");
  const reader = await fetchData(url, body);
  await processStream(reader, callback);
};
