import { NextRequest, NextResponse } from "next/server";
import { changeMemberRole } from "@/app/api/memberships";
import { Role } from "@prisma/client";
import * as Ably from "ably";

export async function POST(req: NextRequest) {
  const { orgId, userId, role } = await req.json();
  await changeMemberRole(orgId, userId, role as Role);
  // Ably событие
  const ably = new Ably.Rest(process.env.ABLY_SERVER_KEY!);
  const channel = ably.channels.get(`org-${orgId}`);
  await channel.publish("update", { type: "member_role_changed", userId, role });
  return NextResponse.json({ success: true });
} 