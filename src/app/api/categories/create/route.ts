import { NextRequest, NextResponse } from "next/server";
import { createCategory } from "@/app/api/categories";
import * as Ably from "ably";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const category = await createCategory(data);
  const ably = new Ably.Rest(process.env.ABLY_SERVER_KEY!);
  const channel = ably.channels.get(`org-${data.organizationId}`);
  await channel.publish("update", { type: "category_created", id: category.id });
  return NextResponse.json({ success: true, category });
} 