"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Role } from "@prisma/client";

export function OrganizationMembers({ orgId, memberships }: { orgId: string; memberships: any[] }) {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("EDITOR");
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      {memberships.map(m => (
        <div key={m.user.id} className="relative group flex items-center">
          <span
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-brand-ui/20 text-brand-dark font-bold text-base border-2 border-white dark:border-zinc-900"
            title={m.user.name ?? m.user.email ?? undefined}
          >
            {m.user.name?.[0] ?? m.user.email?.[0] ?? "?"}
          </span>
          <select
            value={m.role}
            onChange={async e => {
              await fetch("/api/memberships/change-role", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orgId, userId: m.user.id, role: e.target.value }),
              });
              router.refresh();
            }}
            className="absolute left-0 top-10 w-32 rounded-xl border border-brand-ui/20 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-brand-accent bg-white dark:bg-zinc-900 text-brand-dark dark:text-white opacity-0 group-hover:opacity-100 transition-opacity z-20"
          >
            <option value="OWNER">Владелец</option>
            <option value="ADMIN">Админ</option>
            <option value="EDITOR">Редактор</option>
            <option value="VIEWER">Наблюдатель</option>
          </select>
          {m.role !== "OWNER" && (
            <button
              onClick={async () => {
                await fetch("/api/memberships/remove", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ orgId, userId: m.user.id }),
                });
                router.refresh();
              }}
              className="ml-1 text-xs text-red-500 hover:text-red-700"
              title="Удалить участника"
            >✕</button>
          )}
        </div>
      ))}
      <button
        onClick={() => setInviteOpen(true)}
        className="ml-2 bg-brand-accent hover:bg-brand-secondary text-white font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-soft text-xl"
        title="Пригласить участника"
      >+
      </button>
      {inviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-xs p-6 relative animate-fade-in-up flex flex-col items-center">
            <div className="text-lg font-semibold text-brand-dark dark:text-white mb-4 text-center">Пригласить участника</div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full mb-3 rounded-xl border border-brand-ui/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent bg-white dark:bg-zinc-900 text-brand-dark dark:text-white placeholder:text-brand-ui/60"
            />
            <select
              value={role}
              onChange={e => setRole(e.target.value as Role)}
              className="w-full mb-4 rounded-xl border border-brand-ui/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent bg-white dark:bg-zinc-900 text-brand-dark dark:text-white"
            >
              <option value="OWNER">Владелец</option>
              <option value="ADMIN">Админ</option>
              <option value="EDITOR">Редактор</option>
              <option value="VIEWER">Наблюдатель</option>
            </select>
            <div className="flex gap-4 mt-2">
              <button onClick={() => setInviteOpen(false)} className="bg-brand-ui hover:bg-brand-secondary text-white font-semibold px-6 py-2 rounded-2xl shadow-soft transition-all text-base cursor-pointer">Отмена</button>
              <button
                onClick={async () => {
                  await fetch("/api/memberships/invite", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ orgId, email, role }),
                  });
                  router.refresh();
                  setInviteOpen(false);
                }}
                className="bg-brand-accent hover:bg-brand-secondary text-white font-semibold px-6 py-2 rounded-2xl shadow-soft transition-all text-base cursor-pointer"
              >Пригласить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 