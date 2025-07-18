import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import type { Role } from "@prisma/client";

export async function inviteMember(orgId: string, email: string, role: Role) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Not authenticated");
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found");
  return prisma.membership.create({
    data: { userId: user.id, organizationId: orgId, role }
  });
}

export async function removeMember(orgId: string, userId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Not authenticated");
  return prisma.membership.delete({
    where: { userId_organizationId: { userId, organizationId: orgId } }
  });
}

export async function changeMemberRole(orgId: string, userId: string, role: Role) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Not authenticated");
  return prisma.membership.update({
    where: { userId_organizationId: { userId, organizationId: orgId } },
    data: { role }
  });
} 