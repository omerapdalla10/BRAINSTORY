import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { loginAction } from "@/app/auth/login/actions";
import LoginSubmitButton from "@/components/auth/LoginSubmitButton";
import { getSessionProfile } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign In | Brainstory",
};

type LoginPageProps = {
  searchParams: Promise<{
    success?: string;
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getSessionProfile();

  if (user) {
    redirect("/app/dashboard");
  }

  const params = await searchParams;

  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-white text-primary">
      <section className="hidden lg:flex flex-col justify-center gap-10 bg-gradient-to-br from-primary via-[#05506b] to-accent px-16 text-white">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 rounded-2xl bg-white overflow-hidden">
            <Image
              src="/brand/footer/fav%20icon.png"
              alt="Brainstory logo"
              fill
              className="object-contain p-2"
              sizes="64px"
            />
          </div>
          <div>
            <p className="text-3xl font-black leading-tight">Brainstory</p>
            <p className="text-white/70 text-sm">Mental health · Resilience · Peacebuilding</p>
          </div>
        </div>
        <div>
          <h2 className="text-5xl font-black mb-4">Welcome Back</h2>
          <p className="text-lg text-white/80 max-w-md">
            Sign in to manage blogs, categories and site content.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-[460px]">
          <h1 className="text-3xl md:text-4xl font-black mb-2">Staff &amp; Admin Sign In</h1>
          <p className="text-slate-500 mb-8">
            Accounts are created by an administrator. This sign-in is not for the public.
          </p>

          {params.success ? (
            <div className="mb-4 rounded-xl border border-emerald-300/40 bg-emerald-100/60 px-4 py-3 text-emerald-900">
              {params.success}
            </div>
          ) : null}
          {params.error ? (
            <div className="mb-4 rounded-xl border border-rose-300/40 bg-rose-100/60 px-4 py-3 text-rose-900">
              {params.error}
            </div>
          ) : null}

          <form action={loginAction} className="flex flex-col gap-5">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold">Email Address</span>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  mail
                </span>
                <input
                  className="h-14 w-full rounded-xl bg-[#eef3fb] pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-accent/50"
                  name="email"
                  suppressHydrationWarning
                  placeholder="you@brainstory.so"
                  required
                  type="email"
                />
              </div>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold">Password</span>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  lock
                </span>
                <input
                  className="h-14 w-full rounded-xl bg-[#eef3fb] pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-accent/50"
                  name="password"
                  suppressHydrationWarning
                  placeholder="Enter password"
                  required
                  type="password"
                />
              </div>
            </label>

            <LoginSubmitButton />
          </form>
        </div>
      </section>
    </main>
  );
}
