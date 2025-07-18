import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";

export default async function NewOrganizationPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/organizations");
    return null;
  }

  async function createOrg(formData: FormData) {
    "use server";
    const name = formData.get("name")?.toString().trim();
    if (!name) return;
    const user = await prisma.user.findUnique({ where: { email: session.user?.email ?? undefined } });
    if (!user) return;
    const org = await prisma.organization.create({
      data: {
        name,
        memberships: {
          create: {
            userId: user.id,
            role: "OWNER"
          }
        }
      }
    });
    redirect(`/organizations/${org.id}`);
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-brand-dark/90 via-brand-secondary/60 to-brand-soft/40 flex flex-col items-center px-2 sm:px-6 py-8 animate-fade-in">
      <form action={createOrg} className="w-full max-w-md bg-white/80 dark:bg-zinc-900/80 rounded-2xl shadow-xl p-8 flex flex-col gap-6 animate-fade-in-up">
        <h2 className="text-2xl font-bold text-brand-dark dark:text-white text-center mb-2">Создать организацию</h2>
        <input
          name="name"
          type="text"
          required
          minLength={2}
          maxLength={64}
          placeholder="Название организации"
          className="rounded-2xl border border-brand-ui/20 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-brand-accent bg-white dark:bg-zinc-900 text-brand-dark dark:text-white placeholder:text-brand-ui/60"
        />
        <button type="submit" className="bg-brand-accent hover:bg-brand-secondary active:scale-95 text-white font-semibold py-3 px-8 rounded-2xl shadow-soft transition-all duration-200 text-base mt-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-accent/60" style={{ WebkitTapHighlightColor: "transparent" }}>Создать</button>
      </form>
    </div>
  );
} 