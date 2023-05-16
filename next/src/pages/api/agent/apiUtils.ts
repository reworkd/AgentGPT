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
  console.log(env.PLATFORM_URL);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.status === 200) {
      console.log("Platform succeeded.");
      return (await response.json()) as T;
    }
  } catch (e) {
    console.error("Platform failed. Falling back.");
    console.log(e);
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    console.error((e.message || "").substring(0, 500));
  }

  console.log("Falling back.");
  return await fallback();
};
