import { NextRequest, NextResponse } from "next/server";
import { deleteCategory } from "@/app/api/categories";
import * as Ably from "ably";

export async function POST(req: NextRequest) {
  const { id, orgId } = await req.json();
  await deleteCategory(id);
  if (orgId) {
    const ably = new Ably.Rest(process.env.ABLY_SERVER_KEY!);
    const channel = ably.channels.get(`org-${orgId}`);
    await channel.publish("update", { type: "category_deleted", id });
  }
  return NextResponse.json({ success: true });
} 