import { NextRequest, NextResponse } from "next/server";
import { deleteTask } from "@/app/api/tasks";
import * as Ably from "ably";

export async function POST(req: NextRequest) {
  const { id, orgId } = await req.json();
  await deleteTask(id);
  if (orgId) {
    const ably = new Ably.Rest(process.env.ABLY_SERVER_KEY!);
    const channel = ably.channels.get(`org-${orgId}`);
    await channel.publish("update", { type: "task_deleted", id });
  }
  return NextResponse.json({ success: true });
} 