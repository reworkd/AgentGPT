/* eslint-disable react-hooks/exhaustive-deps */
import Pusher from "pusher-js";
import { useEffect } from "react";
import type { z } from "zod";
import { env } from "../env/client.mjs";

export default function useSocket<T extends z.Schema>(
  channelName: string,
  eventSchema: T,
  callback: (data: z.infer<T>) => void
) {
  useEffect(() => {
    const app_key = env.NEXT_PUBLIC_PUSHER_APP_KEY as string | undefined;
    if (!app_key) return () => void 0;

    const pusher = new Pusher(app_key, { cluster: "mt1" });
    const channel = pusher.subscribe(channelName);

    channel.bind("my-event", async (data) => {
      const obj = (await eventSchema.parse(data)) as z.infer<T>;
      callback(obj);
    });

    return () => {
      pusher.unsubscribe(channelName);
    };
  }, []);
}
