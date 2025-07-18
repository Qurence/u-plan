import { SignInButton } from "@/components/auth/SignInButton";
import { Suspense } from "react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

function AnimatedLoader() {
  return (
    <div className="flex justify-center items-center h-24">
      <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

const features = [
  {
    icon: (
      <svg className="w-6 h-6 text-brand-accent" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    ),
    title: "Совместная работа",
    desc: "Работайте над задачами вместе с командой в реальном времени."
  },
  {
    icon: (
      <svg className="w-6 h-6 text-brand-ui" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" /></svg>
    ),
    title: "Drag & Drop",
    desc: "Удобное перемещение задач между категориями."
  },
  {
    icon: (
      <svg className="w-6 h-6 text-brand-secondary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
    ),
    title: "PWA и мобильность",
    desc: "Устанавливайте приложение и работайте офлайн."
  },
  {
    icon: (
      <svg className="w-6 h-6 text-brand-soft" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
    ),
    title: "Realtime и уведомления",
    desc: "Мгновенные обновления и пуш-уведомления."
  },
];

export default async function Home() {
  const session = await getServerSession();
  if (session) redirect("/organizations");

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-brand-dark/90 via-brand-secondary/60 to-brand-soft/40 flex flex-col items-center justify-center px-2 sm:px-6 py-8 animate-fade-in">
      <Suspense fallback={<AnimatedLoader />}> {/* Анимированная загрузка */}
        <div className="w-full max-w-4xl flex flex-col items-center gap-12 animate-fade-in-up">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-brand-dark dark:text-white text-center tracking-tight mb-2 animate-fade-in-up">U-Plan</h1>
          <p className="text-xl sm:text-2xl text-brand-ui dark:text-brand-soft text-center mb-6 animate-fade-in-up delay-100">Минималистичный таск-менеджер для команд</p>
          <SignInButton label="Начать" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full animate-fade-in-up delay-200">
            {features.map((f, i) => (
              <div key={i} className="flex flex-col items-center gap-3 bg-white/60 dark:bg-zinc-900/70 rounded-2xl shadow-lg p-6 backdrop-blur-md hover:scale-105 transition-transform duration-300 animate-fade-in-up" style={{animationDelay: `${300 + i*100}ms`}}>
                <span className="flex items-center justify-center w-12 h-12 rounded-full bg-brand-dark/10 dark:bg-brand-ui/10 shadow-md mb-2 group-hover:animate-bounce">
                  {f.icon}
                </span>
                <span className="font-semibold text-brand-dark dark:text-white text-base text-center tracking-tight">{f.title}</span>
                <span className="text-brand-dark/80 dark:text-brand-soft/90 text-center text-sm leading-snug">{f.desc}</span>
              </div>
            ))}
          </div>
          <div className="w-full flex flex-col items-center gap-4 mt-4 animate-fade-in-up delay-300">
            <span className="text-xs text-brand-ui dark:text-brand-soft opacity-70">© {new Date().getFullYear()} U-Plan</span>
          </div>
        </div>
      </Suspense>
    </div>
  );
}
