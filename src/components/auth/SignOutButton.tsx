"use client";
import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="bg-brand-ui hover:bg-brand-secondary active:scale-95 text-white font-semibold py-2 px-6 rounded-2xl shadow-soft transition-all duration-200 text-base cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-ui/60"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      Выйти
    </button>
  );
} 