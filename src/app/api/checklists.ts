import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import * as Ably from "ably";

export async function createChecklist(data: { title: string; taskId: string; orgId: string; }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Not authenticated");
  const checklist = await prisma.checklist.create({ data: { title: data.title, taskId: data.taskId } });
  // Ably событие
  const ably = new Ably.Rest(process.env.ABLY_SERVER_KEY!);
  const channel = ably.channels.get(`org-${data.orgId}`);
  await channel.publish("update", { type: "checklist_created", id: checklist.id });
  return checklist;
}

export async function updateChecklist(id: string, data: Partial<{ title: string; orgId: string; }>) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Not authenticated");
  const checklist = await prisma.checklist.update({ where: { id }, data });
  if (data.orgId) {
    const ably = new Ably.Rest(process.env.ABLY_SERVER_KEY!);
    const channel = ably.channels.get(`org-${data.orgId}`);
    await channel.publish("update", { type: "checklist_updated", id });
  }
  return checklist;
}

export async function deleteChecklist(id: string, orgId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Not authenticated");
  const checklist = await prisma.checklist.delete({ where: { id } });
  const ably = new Ably.Rest(process.env.ABLY_SERVER_KEY!);
  const channel = ably.channels.get(`org-${orgId}`);
  await channel.publish("update", { type: "checklist_deleted", id });
  return checklist;
}

export async function addChecklistItem(checklistId: string, text: string, orgId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Not authenticated");
  const item = await prisma.checklistItem.create({ data: { checklistId, text } });
  const ably = new Ably.Rest(process.env.ABLY_SERVER_KEY!);
  const channel = ably.channels.get(`org-${orgId}`);
  await channel.publish("update", { type: "checklist_item_added", id: item.id });
  return item;
}

export async function updateChecklistItem(id: string, data: Partial<{ text: string; checked: boolean; orgId: string; }>) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Not authenticated");
  const item = await prisma.checklistItem.update({ where: { id }, data });
  if (data.orgId) {
    const ably = new Ably.Rest(process.env.ABLY_SERVER_KEY!);
    const channel = ably.channels.get(`org-${data.orgId}`);
    await channel.publish("update", { type: "checklist_item_updated", id });
  }
  return item;
}

export async function deleteChecklistItem(id: string, orgId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Not authenticated");
  const item = await prisma.checklistItem.delete({ where: { id } });
  const ably = new Ably.Rest(process.env.ABLY_SERVER_KEY!);
  const channel = ably.channels.get(`org-${orgId}`);
  await channel.publish("update", { type: "checklist_item_deleted", id });
  return item;
}

export async function toggleChecklistItem(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Not authenticated");
  const item = await prisma.checklistItem.findUnique({ where: { id } });
  if (!item) throw new Error("Item not found");
  return prisma.checklistItem.update({ where: { id }, data: { checked: !item.checked } });
}

export async function getChecklistsByTask(taskId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Not authenticated");
  return prisma.checklist.findMany({ where: { taskId }, include: { items: true } });
} 