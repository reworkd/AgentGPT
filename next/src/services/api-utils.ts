import axios from "axios";
import type { Session } from "next-auth";

import { env } from "../env/client.mjs";

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

export const delete_ = async <T>(url: string, accessToken?: string) => {
  const headers: Record<string, string> = {};
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  url = getUrl(url);

  return (
    await axios.delete(url, {
      headers,
    })
  ).data as T;
};

export function getHeaders(session?: Session) {
  const headers: Record<string, string> = {};
  if (session?.accessToken) {
    headers.Authorization = `Bearer ${session.accessToken}`;
  }

  return headers;
}

function getUrl(url: string) {
  return env.NEXT_PUBLIC_BACKEND_URL + url;
}
export async function withRetries(
  fn: () => Promise<void>,
  onError: (error: unknown) => Promise<boolean>, // Function to handle the error and return whether to continue retrying
  retries = 3
): Promise<void> {
  for (let i = 0; i < retries + 1; i++) {
    try {
      return await fn();
    } catch (error) {
      if (!(await onError(error))) return;
    }
  }
}
