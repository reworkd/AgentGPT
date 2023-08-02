/* eslint-disable react-hooks/exhaustive-deps */
import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import { z } from "zod";

import { env } from "../env/client.mjs";

const PresenceInfoSchema = z.object({
  name: z.string().nullish(),
  email: z.string().nullish(),
  image: z.string().nullish(),
});

const PresenceSubscriptionSucceededSchema = z.object({
  count: z.number(),
  me: z.object({
    id: z.string(),
    info: PresenceInfoSchema,
  }),
  members: z.record(PresenceInfoSchema),
});

const PresenceMemberEventSchema = z.object({
  id: z.string(),
  info: PresenceInfoSchema,
});

type PresenceInfo = z.infer<typeof PresenceInfoSchema>;

export default function useSocket<T extends z.Schema, R extends z.Schema>(
  channelName: string | undefined,
  accessToken: string | undefined,
  callbacks: {
    event: string;
    callback: (data: unknown) => Promise<void> | void;
  }[],
  options?: {
    enabled?: boolean;
  }
) {
  const [members, setMembers] = useState<Record<string, PresenceInfo>>({});

  useEffect(() => {
    const app_key = env.NEXT_PUBLIC_PUSHER_APP_KEY;
    if (!app_key || !accessToken || !channelName) return () => void 0;

    const pusher = new Pusher(app_key, {
      cluster: "mt1",
      channelAuthorization: {
        transport: "ajax",
        endpoint: `${env.NEXT_PUBLIC_BACKEND_URL}/api/auth/pusher`,
        headers: {
          Authorization: `Bearer ${accessToken || ""}`,
        },
      },
    });

    const channel = pusher.subscribe("presence-" + channelName);
    callbacks.map(({ event, callback }) => {
      channel.bind(event, async (data) => {
        await callback(data);
      });
    });

    channel.bind("pusher:subscription_succeeded", async (data) => {
      const event = await PresenceSubscriptionSucceededSchema.parseAsync(data);
      setMembers(event.members);
    });

    channel.bind("pusher:member_added", async (data) => {
      const event = await PresenceMemberEventSchema.parseAsync(data);

      setMembers((prev) => ({
        ...prev,
        [event.id]: event.info,
      }));
    });

    channel.bind("pusher:member_removed", async (data) => {
      const event = await PresenceMemberEventSchema.parseAsync(data);
      setMembers(({ [event.id]: _, ...rest }) => rest);
    });

    return () => {
      pusher.unsubscribe(channel.name);
      pusher.disconnect();
      setMembers({});
    };
  }, [accessToken, channelName]);

  return members;
}
