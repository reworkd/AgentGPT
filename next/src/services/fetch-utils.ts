import type { z } from "zod";

import { env } from "../env/client.mjs";

function getHeaders(accessToken: string | undefined, organizationId: string | undefined) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken || ""}`,
    ...(organizationId ? { "X-Organization-Id": organizationId } : {}),
  };
}

export const get = async <T extends z.ZodTypeAny>(
  path: string,
  schema: T,
  accessToken?: string,
  organizationId?: string
): Promise<z.infer<T>> => {
  const response = await fetch(`${env.NEXT_PUBLIC_BACKEND_URL}${path}`, {
    method: "GET",
    headers: getHeaders(accessToken, organizationId),
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
  accessToken?: string,
  organizationId?: string
): Promise<z.infer<T>> => {
  const response = await fetch(`${env.NEXT_PUBLIC_BACKEND_URL}${path}`, {
    body: JSON.stringify(body),
    method: "POST",
    headers: getHeaders(accessToken, organizationId),
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
  accessToken?: string,
  organizationId?: string
): Promise<z.infer<T>> => {
  const response = await fetch(`${env.NEXT_PUBLIC_BACKEND_URL}${path}`, {
    body: JSON.stringify(body),
    method: "PUT",
    headers: getHeaders(accessToken, organizationId),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return schema.parse(await response.json());
};

export const delete_ = async <T extends z.ZodTypeAny>(
  path: string,
  schema: T,
  body: unknown,
  accessToken?: string,
  organizationId?: string
): Promise<z.infer<T>> => {
  const response = await fetch(`${env.NEXT_PUBLIC_BACKEND_URL}${path}`, {
    body: JSON.stringify(body),
    method: "DELETE",
    headers: getHeaders(accessToken, organizationId),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return schema.parse(await response.json());
};
