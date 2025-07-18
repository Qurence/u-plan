import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { SignInButton } from "@/components/auth/SignInButton";

export default async function LoginPage() {
  const session = await getServerSession();
  if (session) redirect("/");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-dark px-4">
      <div className="bg-white rounded-2xl shadow-soft p-8 w-full max-w-sm flex flex-col items-center gap-6">
        <h1 className="text-2xl font-bold text-brand-dark mb-2">Вход в U-Plan</h1>
        <p className="text-brand-secondary text-center mb-4">Планируйте задачи и работайте в команде</p>
        <SignInButton />
      </div>
      <footer className="mt-8 text-brand-ui text-xs opacity-70">© {new Date().getFullYear()} U-Plan</footer>
    </div>
  );
} 