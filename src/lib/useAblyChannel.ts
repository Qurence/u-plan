import { useEffect } from "react";
import { getAblyClient } from "./ablyClient";

export function useAblyChannel(channelName: string, onMessage: () => void) {
  useEffect(() => {
    const ably = getAblyClient();
    const channel = ably.channels.get(channelName);

    channel.subscribe("update", onMessage);

    return () => {
      channel.unsubscribe("update", onMessage);
      // Не вызываем ably.close()!
    };
  }, [channelName, onMessage]);
} 