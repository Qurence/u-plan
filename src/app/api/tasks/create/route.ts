import { NextRequest, NextResponse } from "next/server";
import { createTask } from "@/app/api/tasks";
import * as Ably from "ably";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const task = await createTask(data);
  const ably = new Ably.Rest(process.env.ABLY_SERVER_KEY!);
  const channel = ably.channels.get(`org-${data.organizationId}`);
  await channel.publish("update", { type: "task_created", id: task.id });
  return NextResponse.json({ success: true, task });
} 