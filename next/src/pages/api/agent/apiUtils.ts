import { env } from "../../../env/server.mjs";
import type { RequestBody } from "../../../utils/interfaces";

type Actions = "analyze" | "create" | "start" | "execute";
export const withFallback = async <T>(
  action: Actions,
  body: RequestBody,
  fallback: () => Promise<T>
) => {
  if (!env.PLATFORM_URL) return fallback();
  const url = `${env.PLATFORM_URL as string}/api/agent/${action}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (response.status === 200) {
      return (await response.json()) as T;
    }
  } catch (e) {
    console.error(e);
  }

  return await fallback();
};
