import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { SessionStrategy } from "next-auth";

export async function createAttachment(data: { url: string; taskId: string; isCover?: boolean; }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Not authenticated");
  return prisma.attachment.create({ data });
}

export async function deleteAttachment(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Not authenticated");
  return prisma.attachment.delete({ where: { id } });
}

export async function getAttachmentsByTask(taskId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Not authenticated");
  return prisma.attachment.findMany({ where: { taskId } });
} 