"use client";
import { signIn } from "next-auth/react";

export function SignInButton({ label = "Войти через Google" }: { label?: string }) {
  return (
    <button
      onClick={() => signIn("google")}
      className="w-full flex items-center justify-center gap-2 bg-brand-accent hover:bg-brand-secondary active:scale-95 text-white font-semibold py-3 px-4 rounded-2xl shadow-soft transition-all duration-200 text-base cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-accent/60"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_17_40)">
          <path d="M47.5 24.5C47.5 22.6 47.3 20.8 47 19H24V29.1H37.1C36.5 32.1 34.6 34.6 31.9 36.3V42.1H39.5C44 38.1 47.5 32.1 47.5 24.5Z" fill="#4285F4"/>
          <path d="M24 48C30.6 48 36.1 45.9 39.5 42.1L31.9 36.3C30.1 37.5 27.8 38.3 24 38.3C17.7 38.3 12.2 34.2 10.3 28.7H2.4V34.7C5.8 41.1 14.1 48 24 48Z" fill="#34A853"/>
          <path d="M10.3 28.7C9.8 27.5 9.5 26.2 9.5 24.8C9.5 23.4 9.8 22.1 10.3 20.9V14.9H2.4C0.8 18.1 0 21.4 0 24.8C0 28.2 0.8 31.5 2.4 34.7L10.3 28.7Z" fill="#FBBC05"/>
          <path d="M24 9.7C27.2 9.7 29.7 10.8 31.5 12.5L39.6 5.1C36.1 1.8 30.6 0 24 0C14.1 0 5.8 6.9 2.4 14.9L10.3 20.9C12.2 15.4 17.7 9.7 24 9.7Z" fill="#EA4335"/>
        </g>
        <defs>
          <clipPath id="clip0_17_40">
            <rect width="48" height="48" fill="white"/>
          </clipPath>
        </defs>
      </svg>
      {label}
    </button>
  );
} 