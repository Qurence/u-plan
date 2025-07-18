import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function createLabel(data: { name: string; color: string; organizationId: string; }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Not authenticated");
  return prisma.label.create({ data });
}

export async function updateLabel(id: string, data: Partial<{ name: string; color: string; }>) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Not authenticated");
  return prisma.label.update({ where: { id }, data });
}

export async function deleteLabel(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Not authenticated");
  return prisma.label.delete({ where: { id } });
}

export async function addLabelToTask(labelId: string, taskId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Not authenticated");
  return prisma.task.update({ where: { id: taskId }, data: { labels: { connect: [{ id: labelId }] } } });
}

export async function removeLabelFromTask(labelId: string, taskId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Not authenticated");
  return prisma.task.update({ where: { id: taskId }, data: { labels: { disconnect: [{ id: labelId }] } } });
}

export async function getLabelsByOrganization(organizationId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Not authenticated");
  return prisma.label.findMany({ where: { tasks: { some: { organizationId } } } });
} 