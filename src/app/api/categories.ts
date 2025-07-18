import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { SessionStrategy } from "next-auth";
import * as Ably from "ably";

export async function createCategory(data: { name: string; organizationId: string; }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Not authenticated");
  const category = await prisma.category.create({ data });
  // Ably событие
  const ably = new Ably.Rest(process.env.ABLY_SERVER_KEY!);
  const channel = ably.channels.get(`org-${data.organizationId}`);
  await channel.publish("update", { type: "category_created", id: category.id });
  return category;
}

export async function updateCategory(id: string, data: Partial<{ name: string; }>) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Not authenticated");
  const category = await prisma.category.update({ where: { id }, data });
  // Ably событие
  const ably = new Ably.Rest(process.env.ABLY_SERVER_KEY!);
  const channel = ably.channels.get(`org-${category.organizationId}`);
  await channel.publish("update", { type: "category_updated", id: category.id });
  return category;
}

export async function deleteCategory(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Not authenticated");
  // Сначала удалить все задачи этой категории
  await prisma.task.deleteMany({ where: { categoryId: id } });
  // Потом удалить саму категорию
  return prisma.category.delete({ where: { id } });
}

export async function getCategoriesByOrganization(organizationId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Not authenticated");
  return prisma.category.findMany({ where: { organizationId }, include: { tasks: true } });
} 