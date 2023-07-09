/* eslint-disable react-hooks/exhaustive-deps */
import Pusher from "pusher-js";
import { useEffect } from "react";
import type { z } from "zod";

export default function useSocket<T extends z.Schema>(
  channelName: string,
  eventSchema: T,
  callback: (data: z.infer<T>) => void
) {
  useEffect(() => {
    console.log("connecting to", channelName);
    const pusher = new Pusher("377d23ce6b781644137c", { cluster: "mt1" });
    const channel = pusher.subscribe(channelName);

    channel.bind("my-event", async (data) => {
      console.log(JSON.stringify(data));
      const obj = (await eventSchema.parse(data)) as z.infer<T>;
      callback(obj);
    });

    return () => {
      console.log("disconnecting from", channelName);
      pusher.unsubscribe(channelName);
    };
  }, []);
}
