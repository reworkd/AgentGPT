import { z } from "zod";

import { get } from "../fetch-utils";

const OrganizationUsersSchema = z.object({
  id: z.string(),
  name: z.string(),
  users: z.array(
    z.object({
      id: z.string(),
      role: z.string(),
      user: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
      }),
    })
  ),
});

export class OrganizationApi {
  readonly accessToken?: string;

  constructor(accessToken?: string) {
    this.accessToken = accessToken;
  }

  async get(name: string) {
    return await get(`/api/auth/organization/${name}`, OrganizationUsersSchema, this.accessToken);
  }
}
