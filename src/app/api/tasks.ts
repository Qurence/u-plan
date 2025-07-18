import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { SessionStrategy } from "next-auth";
import * as Ably from "ably";

export async function createTask(data: {
  title: string;
  description?: string;
  categoryId: string;
  organizationId: string;
  assignedToId?: string;
  deadline?: Date;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Not authenticated");
  const task = await prisma.task.create({ data });
  // Ably событие
  const ably = new Ably.Rest(process.env.ABLY_SERVER_KEY!);
  const channel = ably.channels.get(`org-${data.organizationId}`);
  await channel.publish("update", { type: "task_created", id: task.id });
  return task;
}

export async function updateTask(id: string, data: Partial<{
  title: string;
  description: string;
  categoryId: string;
  assignedToId: string;
  deadline: Date;
  completed: boolean;
  archived: boolean;
}>) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Not authenticated");
  const task = await prisma.task.update({ where: { id }, data });
  // Ably событие
  const ably = new Ably.Rest(process.env.ABLY_SERVER_KEY!);
  const channel = ably.channels.get(`org-${task.organizationId}`);
  await channel.publish("update", { type: "task_updated", id: task.id });
  return task;
}

export async function deleteTask(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Not authenticated");
  return prisma.task.delete({ where: { id } });
}

export async function getTask(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Not authenticated");
  return prisma.task.findUnique({ where: { id }, include: { comments: { include: { author: true } }, attachments: true } });
}

export async function getTasksByCategory(categoryId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Not authenticated");
  return prisma.task.findMany({ where: { categoryId }, include: { comments: { include: { author: true } }, attachments: true } });
}

export async function getTasksByOrganization(organizationId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Not authenticated");
  return prisma.task.findMany({ where: { organizationId }, include: { comments: { include: { author: true } }, attachments: true } });
} 