import axios from "axios";
import type { Session } from "next-auth";
import { env } from "../env/client.mjs";
import type { z } from "zod";

export const post = async <T>(url: string, body: unknown, session?: Session) => {
  const headers = getHeaders(session);
  url = getUrl(url);

  return (
    await axios.post(url, body, {
      headers,
    })
  ).data as T;
};

export const get = async <T>(url: string, session?: Session) => {
  const headers = getHeaders(session);
  url = getUrl(url);

  return (
    await axios.get(url, {
      headers,
    })
  ).data as T;
};

function getHeaders(session?: Session) {
  const headers: Record<string, string> = {};
  if (session?.accessToken) {
    headers.Authorization = `Bearer ${session.accessToken}`;
  }

  return headers;
}

function getUrl(url: string) {
  return env.NEXT_PUBLIC_BACKEND_URL + url;
}

export const fetchAPI = async <T extends z.ZodTypeAny>(
  path: string,
  schema: T,
  accessToken?: string
): Promise<z.infer<T>> => {
  const response = await fetch(`${env.NEXT_PUBLIC_BACKEND_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${accessToken || ""}`,
    },
  });

  if (!response.ok) {
    throw new Error("Request failed");
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return schema.parse(await response.json());
};
