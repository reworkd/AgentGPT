import axios from "axios";
import type { Session } from "next-auth";

export const post = async <T>(url: string, body: unknown, session?: Session) => {
  const headers: Record<string, string> = {};

  if (session?.accessToken) {
    headers.Authorization = `Bearer ${session.accessToken}`;
  }

  return (
    await axios.post(url, body, {
      headers,
    })
  ).data as T;
};
