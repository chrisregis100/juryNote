import Link from "next/link";
import { AnimatedSection } from "./animated-section";

export const Hero = () => (
  <section className="relative overflow-hidden bg-white px-6 pb-24 pt-20 md:pb-32 md:pt-28">
    <div className="absolute right-12 top-16 h-20 w-20 rounded-full bg-yellow-400 opacity-60 md:right-24 md:top-20 md:h-28 md:w-28" aria-hidden="true" />
    <div className="absolute bottom-20 left-8 h-16 w-16 rotate-12 bg-rose-500 opacity-50 md:left-16 md:h-20 md:w-20" aria-hidden="true" />
    <div className="absolute left-1/3 top-32 h-0 w-0 border-b-40 border-l-24 border-r-24 border-b-indigo-600 border-l-transparent border-r-transparent opacity-40 md:top-24" aria-hidden="true" />
    <div className="absolute bottom-40 right-1/4 h-10 w-10 -rotate-6 border-4 border-yellow-400 opacity-50" aria-hidden="true" />

    <div className="mx-auto max-w-5xl">
      <AnimatedSection immediate>
        <h1 className="text-center text-5xl font-black leading-tight tracking-tight text-black md:text-7xl lg:text-8xl">
          De l&apos;inscription
          <br />
          à la{" "}
          <span className="relative inline-block">
            <span className="relative z-10 -rotate-1 bg-yellow-400 px-3 py-1 inline-block">
              remise des prix.
            </span>
          </span>
        </h1>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <p className="mx-auto mt-8 max-w-2xl text-center text-lg text-slate-600 md:text-xl">
          Check-in fluide, distribution automatique de ressources,
          <br className="hidden md:block" />
          notation en temps réel et délibération collaborative — tout en un.
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
            Organiser un événement
          </Link>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.35}>
        <div className="mx-auto mt-16 max-w-2xl rounded-xl border-2 border-black bg-white shadow-[8px_8px_0_0_#0a0a0a] overflow-hidden">
          <div className="flex items-center gap-2 border-b-2 border-black bg-slate-50 px-4 py-3">
            <div className="h-3 w-3 rounded-full bg-rose-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-400" />
            <div className="h-3 w-3 rounded-full bg-emerald-400" />
            <span className="ml-3 text-xs font-medium text-slate-400">JuryNote — Dashboard</span>
          </div>
          <div className="flex gap-0 border-b-2 border-black">
            {(["Check-in", "Notation", "Délibération"] as const).map((tab, i) => (
              <div
                key={tab}
                className={`px-4 py-2 text-xs font-bold border-r-2 border-black ${i === 0 ? "bg-yellow-400 text-black" : "bg-white text-slate-500"}`}
              >
                {tab}
              </div>
            ))}
          </div>
          <div className="p-4 md:p-6 space-y-3">
            {[
              { label: "Marie Dupont", badge: "✓ Check-in", score: 92, color: "bg-indigo-600", badgeColor: "bg-emerald-100 text-emerald-700" },
              { label: "Thomas Remy", badge: "✓ Check-in", score: 85, color: "bg-yellow-400", badgeColor: "bg-emerald-100 text-emerald-700" },
              { label: "Aïcha Cissé", badge: "⏳ En attente", score: 71, color: "bg-rose-500", badgeColor: "bg-yellow-100 text-yellow-700" },
              { label: "Marc Koné", badge: "✓ Check-in", score: 68, color: "bg-emerald-400", badgeColor: "bg-emerald-100 text-emerald-700" },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-3">
                <span className="w-28 text-xs font-medium text-slate-700 md:w-32 shrink-0">{row.label}</span>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${row.badgeColor}`}>{row.badge}</span>
                <div className="relative h-5 flex-1 overflow-hidden rounded border border-slate-200 bg-slate-50">
                  <div className={`absolute inset-y-0 left-0 ${row.color}`} style={{ width: `${row.score}%` }} />
                </div>
                <span className="w-10 text-right text-xs font-bold text-black shrink-0">{row.score}%</span>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </div>
  </section>
);
