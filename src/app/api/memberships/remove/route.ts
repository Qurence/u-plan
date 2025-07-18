import { NextRequest, NextResponse } from "next/server";
import { removeMember } from "@/app/api/memberships";
import * as Ably from "ably";

export async function POST(req: NextRequest) {
  const { orgId, userId } = await req.json();
  await removeMember(orgId, userId);
  // Ably событие
  const ably = new Ably.Rest(process.env.ABLY_SERVER_KEY!);
  const channel = ably.channels.get(`org-${orgId}`);
  await channel.publish("update", { type: "member_removed", userId });
  return NextResponse.json({ success: true });
} 