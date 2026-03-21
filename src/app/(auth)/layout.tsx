import Link from "next/link";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Left branded panel */}
      <div className="relative hidden w-[45%] overflow-hidden bg-black lg:flex lg:flex-col lg:items-center lg:justify-center">
        {/* Dot pattern overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle, #4f46e5 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
          aria-hidden="true"
        />

        {/* Decorative geometric shapes */}
        <div
          className="absolute right-16 top-20 h-24 w-24 rounded-full bg-yellow-400 opacity-60 blur-[1px]"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-24 left-12 h-18 w-18 rotate-12 bg-rose-500 opacity-50"
          aria-hidden="true"
        />
        <div
          className="absolute left-1/4 top-1/4 h-12 w-12 -rotate-6 border-4 border-indigo-400 opacity-50"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-1/3 right-1/5 h-16 w-16 rounded-full border-4 border-emerald-400 opacity-40"
          aria-hidden="true"
        />
        <div
          className="absolute right-1/3 top-1/3 h-10 w-10 rotate-45 bg-indigo-500 opacity-50"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-16 right-20 h-8 w-8 -rotate-12 border-4 border-yellow-400 opacity-40"
          aria-hidden="true"
        />

        {/* Branded content */}
        <div className="relative z-10 px-12 text-center">
          <Link href="/" className="group inline-block">
            <div className="inline-block -rotate-2 bg-yellow-400 px-5 py-2.5 transition-transform group-hover:rotate-0">
              <span className="text-4xl font-black tracking-tight text-black">
                JuryFlow
              </span>
            </div>
          </Link>

          <p className="mt-8 text-lg leading-relaxed text-slate-400">
            La notation de jury,
            <br />
            <span className="font-semibold text-white">enfin simplifiée.</span>
          </p>

          {/* Mini dashboard mockup */}
          <div className="mx-auto mt-12 max-w-xs rounded-xl border-2 border-slate-700 bg-slate-900/80 p-5 shadow-[6px_6px_0_0_#4f46e5] backdrop-blur-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-rose-500" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span className="ml-2 text-[10px] font-medium text-slate-500">
                JuryFlow
              </span>
            </div>
            <div className="space-y-2.5">
              {(
                [
                  { w: "82%", color: "bg-indigo-500" },
                  { w: "65%", color: "bg-yellow-400" },
                  { w: "48%", color: "bg-rose-500" },
                  { w: "36%", color: "bg-emerald-400" },
                ] as const
              ).map((bar, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-1.5 w-12 rounded bg-slate-800" />
                  <div className="h-3 flex-1 overflow-hidden rounded bg-slate-800">
                    <div
                      className={`h-full rounded ${bar.color}`}
                      style={{ width: bar.w }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="relative flex flex-1 flex-col items-center justify-center p-6 sm:p-10 lg:p-16">
        {/* Subtle dot pattern on the right panel */}
        <div className="dot-pattern-light absolute inset-0 opacity-40" aria-hidden="true" />

        {/* Mobile brand header */}
        <div className="relative z-10 mb-10 lg:hidden">
          <Link href="/" className="inline-block -rotate-2 bg-yellow-400 px-4 py-1.5">
            <span className="text-2xl font-black tracking-tight text-black">
              JuryFlow
            </span>
          </Link>
        </div>

        <div className="relative z-10 w-full max-w-md">{children}</div>

        <div className="relative z-10 mt-10">
          <Link
            href="/"
            className="text-sm text-slate-400 transition-colors hover:text-slate-600"
          >
            &larr; Retour &agrave; l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
