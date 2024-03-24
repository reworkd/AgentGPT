import type { Session } from "next-auth";
import { z } from "zod";

import { env } from "../../env/client.mjs";
import { get } from "../fetch-utils";

export default class OauthApi {
  readonly accessToken?: string;
  readonly organizationId?: string;

  constructor(accessToken?: string, organizationId?: string) {
    this.accessToken = accessToken;
    this.organizationId = organizationId;
  }

  static fromSession(session: Session | null) {
    return new OauthApi(session?.accessToken, session?.user?.organizations[0]?.id);
  }

  async install(provider: string, redirectUri?: string) {
    const url = `${env.NEXT_PUBLIC_VERCEL_URL}${redirectUri || ""}`;

    return await get(
      `/api/auth/${provider}?redirect=${encodeURIComponent(url)}`,
      z.string().url(),
      this.accessToken,
      this.organizationId
    );
  }

  async uninstall(provider: string) {
    return await get(
      `/api/auth/${provider}/uninstall`,
      z.object({
        success: z.boolean(),
      }),
      this.accessToken,
      this.organizationId
    );
  }
  // TODO: decouple this
  async get_info(provider: string) {
    return await get(
      `/api/auth/${provider}/info`,
      z
        .object({
          name: z.string(),
          id: z.string(),
        })
        .array(),
      this.accessToken,
      this.organizationId
    );
  }

  async get_info_sid() {
    return await get(
      `/api/auth/sid/info`,
      z.object({
        connected: z.boolean(),
      }),
      this.accessToken,
      this.organizationId
    );
  }
}
