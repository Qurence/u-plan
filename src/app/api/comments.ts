import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { SessionStrategy } from "next-auth";

export async function createComment(data: { content: string; taskId: string; authorId: string; }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Not authenticated");
  return prisma.comment.create({ data });
}

export async function updateComment(id: string, data: Partial<{ content: string; }>) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Not authenticated");
  return prisma.comment.update({ where: { id }, data });
}

export async function deleteComment(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Not authenticated");
  return prisma.comment.delete({ where: { id } });
}

export async function getCommentsByTask(taskId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Not authenticated");
  return prisma.comment.findMany({ where: { taskId }, include: { author: true } });
} 