import Link from "next/link";

import { AnimatedSection } from "./animated-section";

export const Hero = () => (
  <section className="relative overflow-hidden bg-white px-6 pb-24 pt-20 md:pb-32 md:pt-28">
    {/* Decorative shapes */}
    <div
      className="absolute right-12 top-16 h-20 w-20 rounded-full bg-yellow-400 opacity-60 md:right-24 md:top-20 md:h-28 md:w-28"
      aria-hidden="true"
    />
    <div
      className="absolute bottom-20 left-8 h-16 w-16 rotate-12 bg-rose-500 opacity-50 md:left-16 md:h-20 md:w-20"
      aria-hidden="true"
    />
    <div
      className="absolute left-1/3 top-32 h-0 w-0 border-b-40 border-l-24 border-r-24 border-b-indigo-600 border-l-transparent border-r-transparent opacity-40 md:top-24"
      aria-hidden="true"
    />
    <div
      className="absolute bottom-40 right-1/4 h-10 w-10 -rotate-6 border-4 border-yellow-400 opacity-50"
      aria-hidden="true"
    />

    <div className="mx-auto max-w-5xl">
      <AnimatedSection immediate>
        <h1 className="text-center text-5xl font-black leading-tight tracking-tight text-black md:text-7xl lg:text-8xl">
          La notation de jury,
          <br />
          <span className="relative inline-block">
            <span className="relative z-10 -rotate-1 bg-yellow-400 px-3 py-1 inline-block">
              enfin
            </span>
          </span>{" "}
          simplifiée.
        </h1>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <p className="mx-auto mt-8 max-w-2xl text-center text-lg text-slate-600 md:text-xl">
          Organisez, notez et délibérez en temps réel.
          <br className="hidden md:block" />
          Plus de tableurs, plus de chaos.
        </p>
      </AnimatedSection>

      <AnimatedSection delay={0.2}>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#demo"
            className="inline-flex h-12 items-center rounded-md border-2 border-black bg-black px-8 text-base font-bold text-white shadow-[4px_4px_0_0_#4f46e5] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#4f46e5]"
          >
            Demander une démo
          </a>
          <Link
            href="/admin"
            className="inline-flex h-12 items-center rounded-md border-2 border-black bg-white px-8 text-base font-bold text-black transition-all hover:bg-slate-50"
          >
            Gérer un événement
          </Link>
        </div>
      </AnimatedSection>

      {/* Mini dashboard mockup */}
      <AnimatedSection delay={0.35}>
        <div className="mx-auto mt-16 max-w-2xl rounded-xl border-2 border-black bg-white p-4 shadow-[8px_8px_0_0_#0a0a0a] md:p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-rose-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-400" />
            <div className="h-3 w-3 rounded-full bg-emerald-400" />
            <span className="ml-3 text-xs font-medium text-slate-400">
              JuryFlow — Dashboard
            </span>
          </div>
          <div className="space-y-3">
            {[
              { label: "Équipe Alpha", score: 85, color: "bg-indigo-600" },
              { label: "Équipe Beta", score: 72, color: "bg-yellow-400" },
              { label: "Équipe Gamma", score: 64, color: "bg-rose-500" },
              { label: "Équipe Delta", score: 58, color: "bg-emerald-400" },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-3">
                <span className="w-28 text-xs font-medium text-slate-600 md:w-32">
                  {row.label}
                </span>
                <div className="relative h-6 flex-1 overflow-hidden rounded border border-slate-200 bg-slate-50">
                  <div
                    className={`absolute inset-y-0 left-0 ${row.color}`}
                    style={{ width: `${row.score}%` }}
                  />
                </div>
                <span className="w-10 text-right text-xs font-bold text-black">
                  {row.score}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </div>
  </section>
);
