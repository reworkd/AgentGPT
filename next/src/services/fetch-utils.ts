import { env } from "../env/client.mjs";
import type { z } from "zod";

export const get = async <T extends z.ZodTypeAny>(
  path: string,
  schema: T,
  accessToken?: string
): Promise<z.infer<T>> => {
  const response = await fetch(`${env.NEXT_PUBLIC_BACKEND_URL}${path}`, {
    method: "GET",
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

export const post = async <T extends z.ZodTypeAny>(
  path: string,
  schema: T,
  body: unknown,
  accessToken?: string
): Promise<z.infer<T>> => {
  const response = await fetch(`${env.NEXT_PUBLIC_BACKEND_URL}${path}`, {
    body: JSON.stringify(body),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken || ""}`,
    },
  });

  if (!response.ok) {
    throw new Error("Request failed");
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return schema.parse(await response.json());
};

export const put = async <T extends z.ZodTypeAny>(
  path: string,
  schema: T,
  body: unknown,
  accessToken?: string
): Promise<z.infer<T>> => {
  const response = await fetch(`${env.NEXT_PUBLIC_BACKEND_URL}${path}`, {
    body: JSON.stringify(body),
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken || ""}`,
    },
  });

  if (!response.ok) {
    throw new Error("Request failed");
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return schema.parse(await response.json());
};
