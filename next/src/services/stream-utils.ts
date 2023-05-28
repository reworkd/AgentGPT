import { env } from "../env/client.mjs";

const fetchData = async (url: string) => {
  url = env.NEXT_PUBLIC_BACKEND_URL + url;
  const response = await fetch(url, {
    method: "POST",
    cache: "no-cache",
    keepalive: true,
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
  });

  return response.body?.getReader();
};

async function processStream(
  reader: ReadableStreamDefaultReader<Uint8Array> | undefined,
  callback: (text: string) => void
) {
  if (reader) {
    while (true) {
      const result = await reader.read();
      if (result.done) {
        console.log("Stream closed");
        break;
      }
      const text = new TextDecoder().decode(result.value);
      callback(text);
    }
  }
}

export const steamText = async (url: string, callback: (text: string) => void) => {
  const reader = await fetchData(url);
  const promise = processStream(reader, callback);
  promise.catch((error) => {
    console.error("Error reading stream:", error);
  });
};
