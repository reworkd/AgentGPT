import type { Session } from "next-auth";
import { z } from "zod";

import { env } from "../../env/client.mjs";
import { get } from "../fetch-utils";

export default class OauthApi {
  readonly accessToken?: string;
  readonly organizationId?: string;
  readonly redirectUri: string;

  constructor(accessToken?: string, organizationId?: string, redirectUri?: string) {
    this.accessToken = accessToken;
    this.organizationId = organizationId;
    this.redirectUri = `${env.NEXT_PUBLIC_VERCEL_URL}${redirectUri || ""}`;
  }

  static fromSession(session: Session | null, redirectUri?: string) {
    return new OauthApi(session?.accessToken, session?.user?.organizations[0]?.id, redirectUri);
  }

  async install(provider: string) {
    return await get(
      `/api/auth/${provider}?redirect=${encodeURIComponent(this.redirectUri)}`,
      z.string().url(),
      this.accessToken,
      this.organizationId
    );
  }
}
