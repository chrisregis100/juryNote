import { BarChart3, ChevronRight, Play, Trophy, Users } from "lucide-react";
import Link from "next/link";
import { AnimatedSection } from "./animated-section";

export const Hero = () => (
  <section className="relative overflow-hidden bg-slate-50 px-4 pb-24 pt-32 sm:px-6 lg:px-8 flex flex-col items-center text-center">
    {/* Subtle background gradient */}
    <div
      className="pointer-events-none absolute inset-0 bg-linear-to-b from-slate-100/60 via-slate-50 to-slate-50"
      aria-hidden="true"
    />

    <div className="relative w-full max-w-7xl mx-auto flex flex-col items-center">
      {/* Badge */}
      <AnimatedSection immediate>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-sm font-medium mb-8">
          <span
            className="flex h-2 w-2 rounded-full bg-slate-500"
            aria-hidden="true"
          />
          Nouveau&nbsp;: Gestion simplifiée des hackathons
          <ChevronRight className="w-4 h-4 text-slate-500" aria-hidden="true" />
        </div>
      </AnimatedSection>

      {/* Headline */}
      <AnimatedSection delay={0.05}>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl leading-[1.1]">
          Organisez, notez et délibérez — <br className="hidden sm:block" />
          <span className="text-slate-900 decoration-slate-300">
            en un seul outil.
          </span>
        </h1>
      </AnimatedSection>

      {/* Sub-headline */}
      <AnimatedSection delay={0.1}>
        <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed">
          JuryNote simplifie la gestion complète de vos concours, hackathons et
          jurys. Du check-in des participants au classement final.
        </p>
      </AnimatedSection>

      {/* CTAs */}
      <AnimatedSection delay={0.15}>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md sm:max-w-none">
          <a
            href="#demo"
            className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-xl font-medium transition-all shadow-sm flex items-center justify-center gap-2"
          >
            Essayer gratuitement
          </a>
          <Link
            href="/admin"
            className="bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-900 px-8 py-3.5 rounded-xl font-medium transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-slate-900" aria-hidden="true" />
            Voir la démo
          </Link>
        </div>
      </AnimatedSection>

      {/* Dashboard Mockup */}
      <AnimatedSection delay={0.3}>
        <div className="mt-20 w-full max-w-5xl relative">
          {/* Glow */}
          <div
            className="absolute -inset-1 bg-linear-to-b from-slate-200/40 to-transparent blur-2xl opacity-50 rounded-4xl"
            aria-hidden="true"
          />

          <div className="relative bg-white rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-200/60 overflow-hidden flex flex-col text-left">
            {/* Browser chrome */}
            <div className="bg-slate-50/80 backdrop-blur border-b border-slate-200/60 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5" aria-hidden="true">
                <div className="w-3 h-3 rounded-full bg-rose-400 border border-rose-500/20" />
                <div className="w-3 h-3 rounded-full bg-amber-400 border border-amber-500/20" />
                <div className="w-3 h-3 rounded-full bg-emerald-400 border border-emerald-500/20" />
              </div>
              <div className="mx-auto bg-white border border-slate-200 rounded-md px-3 py-1 text-xs text-slate-400 font-medium flex items-center gap-2 w-64 justify-center shadow-sm">
                <div
                  className="w-3 h-3 rounded-sm bg-slate-100"
                  aria-hidden="true"
                />
                app.jurynote.com
              </div>
            </div>

            {/* Dashboard */}
            <div className="flex flex-1 h-[500px]">
              {/* Sidebar */}
              <div className="w-64 border-r border-slate-100 bg-slate-50/50 p-4 hidden md:flex flex-col gap-6">
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">
                    Concours Actuel
                  </div>
                  <div className="bg-white border border-slate-200 text-slate-700 rounded-lg px-3 py-2 text-sm font-medium shadow-sm flex items-center gap-2">
                    <Trophy className="w-4 h-4" aria-hidden="true" />
                    Hackathon IA 2026
                  </div>
                  <div className="text-slate-600 hover:bg-slate-100 rounded-lg px-3 py-2 text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer">
                    <Users className="w-4 h-4" aria-hidden="true" />
                    Participants
                  </div>
                  <div className="text-slate-600 hover:bg-slate-100 rounded-lg px-3 py-2 text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer">
                    <BarChart3 className="w-4 h-4" aria-hidden="true" />
                    Résultats
                  </div>
                </div>
              </div>

              {/* Main content */}
              <div className="flex-1 p-8 bg-white overflow-hidden flex flex-col">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Classement en direct
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                      Dernière mise à jour il y a 2 minutes
                    </p>
                  </div>
                  <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm">
                    Exporter CSV
                  </button>
                </div>

                {/* Leaderboard table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden flex-1 flex flex-col">
                  <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 grid grid-cols-12 gap-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <div className="col-span-1">Rang</div>
                    <div className="col-span-5">Équipe / Projet</div>
                    <div className="col-span-3">Catégorie</div>
                    <div className="col-span-3 text-right">Score Global</div>
                  </div>

                  <div className="flex-1 overflow-hidden flex flex-col divide-y divide-slate-100">
                    {[
                      {
                        rank: 1,
                        name: "DataMinds",
                        project: "Analyse prédictive",
                        cat: "Innovation IA",
                        score: "9.8/10",
                        trend: "up",
                      },
                      {
                        rank: 2,
                        name: "EcoTech Solutions",
                        project: "Optimisation énergie",
                        cat: "GreenTech",
                        score: "9.5/10",
                        trend: "same",
                      },
                      {
                        rank: 3,
                        name: "HealthSync",
                        project: "Suivi patient",
                        cat: "HealthTech",
                        score: "9.2/10",
                        trend: "up",
                      },
                      {
                        rank: 4,
                        name: "EduFuture",
                        project: "Apprentissage adaptatif",
                        cat: "EdTech",
                        score: "8.9/10",
                        trend: "down",
                      },
                    ].map((row, i) => (
                      <div
                        key={row.rank}
                        className="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-slate-50/50 transition-colors"
                      >
                        <div className="col-span-1 flex items-center gap-2">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              i === 0
                                ? "bg-amber-100 text-amber-700"
                                : i === 1
                                  ? "bg-slate-200 text-slate-700"
                                  : i === 2
                                    ? "bg-orange-100 text-orange-700"
                                    : "text-slate-500"
                            }`}
                          >
                            {row.rank}
                          </span>
                        </div>
                        <div className="col-span-5">
                          <div className="font-semibold text-slate-900">
                            {row.name}
                          </div>
                          <div className="text-sm text-slate-500">
                            {row.project}
                          </div>
                        </div>
                        <div className="col-span-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                            {row.cat}
                          </span>
                        </div>
                        <div className="col-span-3 text-right font-bold text-slate-900 flex items-center justify-end gap-2">
                          {row.score}
                          {row.trend === "up" && (
                            <div
                              className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                              aria-hidden="true"
                            />
                          )}
                          {row.trend === "down" && (
                            <div
                              className="w-1.5 h-1.5 rounded-full bg-rose-500"
                              aria-hidden="true"
                            />
                          )}
                          {row.trend === "same" && (
                            <div
                              className="w-1.5 h-1.5 rounded-full bg-slate-300"
                              aria-hidden="true"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  </section>
);
