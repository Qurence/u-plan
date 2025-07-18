import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { OrganizationMembers } from "@/components/organizations/OrganizationMembers";

async function createCategory(orgId: string, formData: FormData) {
  "use server";
  const name = formData.get("name")?.toString().trim();
  if (!name) return;
  await prisma.category.create({
    data: { name, organizationId: orgId },
  });
  revalidatePath(`/organizations/${orgId}`);
}

async function createTask(categoryId: string, orgId: string, formData: FormData) {
  "use server";
  const title = formData.get("title")?.toString().trim();
  if (!title) return;
  await prisma.task.create({
    data: { title, categoryId, organizationId: orgId },
  });
  revalidatePath(`/organizations/${orgId}`);
}

async function moveTask(taskId: string, toCategoryId: string, newIndex: number, orgId: string) {
  "use server";
  await prisma.task.update({ where: { id: taskId }, data: { categoryId: toCategoryId } });
  revalidatePath(`/organizations/${orgId}`);
}

export default async function OrganizationPage({ params }: { params: { id: string } }) {
  const awaitedParams = await Promise.resolve(params);
  const session = await getServerSession();
  if (!session) notFound();

  const org = await prisma.organization.findUnique({
    where: { id: awaitedParams.id },
    include: {
      categories: {
        include: {
          tasks: {
            include: {
              assignedTo: true,
              attachments: true,
              comments: true,
              labels: true,
              checklists: { include: { items: true } },
            },
            orderBy: { createdAt: "asc" }
          }
        },
        orderBy: { createdAt: "asc" }
      },
      memberships: {
        include: { user: true }
      }
    }
  });
  if (!org) notFound();

  // Преобразуем данные для KanbanBoard
  const categories = org.categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    organizationId: org.id, // обязательно для типа Category
    tasks: cat.tasks.map(t => ({
      id: t.id,
      title: t.title,
      description: t.description || "",
      labels: t.labels || [],
      attachments: t.attachments || [],
      comments: t.comments || [],
      checklists: t.checklists || [],
      deadline: t.deadline,
      completed: t.completed,
      archived: t.archived,
      members: t.assignedTo ? [t.assignedTo] : [],
      cover: (() => {
        const url = t.attachments?.find(a => a.isCover)?.url;
        return typeof url === 'string' ? url : undefined;
      })(),
    }))
  }));

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-brand-dark/90 via-brand-secondary/60 to-brand-soft/40">
      {/* Верхняя панель Dashboard */}
      <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-zinc-900/80 shadow-lg flex items-center justify-between px-6 py-4 gap-4 border-b border-brand-ui/10">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark dark:text-white tracking-tight">{org.name}</h1>
          {/* TODO: Меню доски, фильтры, поиск */}
        </div>
        <OrganizationMembers orgId={org.id} memberships={org.memberships} />
      </header>
      {/* Основной контент Dashboard */}
      <main className="flex-1 flex flex-col items-center w-full h-full overflow-x-auto">
        <div className="w-full max-w-full h-full flex flex-col gap-8 px-2 sm:px-6 py-6 animate-fade-in-up">
          {/* KanbanBoard на весь экран */}
          <div className="w-full h-full overflow-x-auto">
            <KanbanBoard initialCategories={categories} orgId={org.id} />
          </div>
        </div>
      </main>
    </div>
  );
} 