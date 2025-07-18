import * as Ably from "ably";

let ablyRealtime: Ably.Realtime | null = null;

export function getAblyClient() {
  if (!ablyRealtime) {
    ablyRealtime = new Ably.Realtime({ key: process.env.NEXT_PUBLIC_ABLY_KEY! });
  }
  return ablyRealtime;
} 