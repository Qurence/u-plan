import { NextRequest, NextResponse } from "next/server";
import { updateTask } from "@/app/api/tasks";

export async function POST(req: NextRequest) {
  const { id, data } = await req.json();
  if (!id || !data) return NextResponse.json({ success: false, error: "Missing id or data" }, { status: 400 });
  const task = await updateTask(id, data);
  return NextResponse.json({ success: true, task });
} 