import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { SignOutButton } from "@/components/auth/SignOutButton";

export default async function OrganizationsPage() {
  const session = await getServerSession();
  if (!session) return null;

  // Получаем организации пользователя
  const user = await prisma.user.findUnique({
    where: { email: session.user?.email ?? undefined },
    include: {
      memberships: {
        include: { organization: true }
      }
    }
  });
  const orgs = user?.memberships.map(m => m.organization) ?? [];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-brand-dark/90 via-brand-secondary/60 to-brand-soft/40 flex flex-col items-center px-2 sm:px-6 py-8 animate-fade-in">
      <div className="w-full max-w-3xl flex flex-col items-center gap-8 animate-fade-in-up">
        <div className="w-full flex justify-between items-center mb-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-dark dark:text-white text-center tracking-tight">Мои организации</h2>
          <SignOutButton />
        </div>
        <div className="w-full flex flex-col gap-4">
          {orgs.length === 0 && (
            <div className="text-center text-brand-ui dark:text-brand-soft/80 text-lg">У вас пока нет организаций.</div>
          )}
          {orgs.map(org => (
            <Link key={org.id} href={`/organizations/${org.id}`} className="block bg-white/80 dark:bg-zinc-900/80 rounded-2xl shadow-md p-5 hover:shadow-xl hover:scale-[1.02] transition-all border border-brand-ui/10">
              <div className="font-bold text-brand-dark dark:text-white text-xl mb-1">{org.name}</div>
              <div className="text-brand-secondary dark:text-brand-soft text-sm">ID: {org.id}</div>
            </Link>
          ))}
        </div>
        <form action="/organizations/new" method="get" className="w-full flex justify-center">
          <button type="submit" className="bg-brand-accent hover:bg-brand-secondary active:scale-95 text-white font-semibold py-3 px-8 rounded-2xl shadow-soft transition-all duration-200 text-base mt-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-accent/60" style={{ WebkitTapHighlightColor: "transparent" }}>Создать организацию</button>
        </form>
      </div>
    </div>
  );
} 