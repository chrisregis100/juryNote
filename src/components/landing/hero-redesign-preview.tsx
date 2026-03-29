import React from "react";
import { Play, CheckCircle2, Users, Trophy, Star, ChevronRight, BarChart3 } from "lucide-react";

export default function HeroRedesignPreview() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-yellow-100 selection:text-yellow-900">
      {/* Navigation Bar (Mock) */}
      <header className="absolute top-0 w-full border-b border-slate-200/50 bg-white/50 backdrop-blur-md z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-xl text-slate-900 tracking-tight">JuryNote</span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-slate-900 transition-colors">Produit</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Cas d'usage</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Tarifs</a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Connexion
            </button>
            <button className="text-sm font-medium bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors">
              S'inscrire
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Subtle Highlight Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium mb-8">
          <span className="flex h-2 w-2 rounded-full bg-amber-500"></span>
          Nouveau : Gestion simplifiée des hackathons
          <ChevronRight className="w-4 h-4 text-amber-500" />
        </div>

        {/* Headlines */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl leading-[1.1]">
          Organisez, notez et délibérez — <br className="hidden sm:block" />
          <span className="text-yellow-400">en un seul outil.</span>
        </h1>
        
        <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed">
          JuryNote simplifie la gestion complète de vos concours, hackathons et jurys. Du check-in des participants au classement final.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md sm:max-w-none">
          <button className="bg-yellow-400 hover:bg-yellow-400 text-slate-900 px-8 py-3.5 rounded-xl font-medium transition-all shadow-sm shadow-yellow-400/20 flex items-center justify-center gap-2">
            Essayer gratuitement
          </button>
          <button className="bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-900 px-8 py-3.5 rounded-xl font-medium transition-all shadow-sm flex items-center justify-center gap-2">
            <Play className="w-4 h-4 fill-slate-900" />
            Voir la démo
          </button>
        </div>

        {/* Social Proof */}
        <div className="mt-12 flex items-center gap-4 text-sm text-slate-500">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-50 bg-slate-200 flex items-center justify-center overflow-hidden">
                <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <p>Rejoint par plus de <span className="font-semibold text-slate-700">2,000</span> organisateurs</p>
        </div>

        {/* Dashboard Mockup */}
        <div className="mt-20 w-full max-w-5xl relative perspective-1000">
          {/* Decorative background glow */}
          <div className="absolute -inset-1 bg-gradient-to-b from-yellow-400/20 to-transparent blur-2xl opacity-50 rounded-[2rem]"></div>
          
          <div className="relative bg-white rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-200/60 overflow-hidden flex flex-col text-left">
            {/* Browser Header */}
            <div className="bg-slate-50/80 backdrop-blur border-b border-slate-200/60 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-400 border border-rose-500/20"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400 border border-amber-500/20"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400 border border-emerald-500/20"></div>
              </div>
              <div className="mx-auto bg-white border border-slate-200 rounded-md px-3 py-1 text-xs text-slate-400 font-medium flex items-center gap-2 w-64 justify-center shadow-sm">
                <div className="w-3 h-3 rounded-sm bg-slate-100"></div>
                app.jurynote.com
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="flex flex-1 h-[500px]">
              {/* Sidebar */}
              <div className="w-64 border-r border-slate-100 bg-slate-50/50 p-4 hidden md:flex flex-col gap-6">
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">Concours Actuel</div>
                  <div className="bg-white border border-slate-200 text-yellow-700 rounded-lg px-3 py-2 text-sm font-medium shadow-sm flex items-center gap-2">
                    <Trophy className="w-4 h-4" />
                    Hackathon IA 2026
                  </div>
                  <div className="text-slate-600 hover:bg-slate-100 rounded-lg px-3 py-2 text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer">
                    <Users className="w-4 h-4" />
                    Participants
                  </div>
                  <div className="text-slate-600 hover:bg-slate-100 rounded-lg px-3 py-2 text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer">
                    <BarChart3 className="w-4 h-4" />
                    Résultats
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 p-8 bg-white overflow-hidden flex flex-col">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Classement en direct</h2>
                    <p className="text-slate-500 text-sm mt-1">Dernière mise à jour il y a 2 minutes</p>
                  </div>
                  <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm">
                    Exporter CSV
                  </button>
                </div>

                {/* Table Mockup */}
                <div className="border border-slate-200 rounded-xl overflow-hidden flex-1 flex flex-col">
                  <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 grid grid-cols-12 gap-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <div className="col-span-1">Rang</div>
                    <div className="col-span-5">Équipe / Projet</div>
                    <div className="col-span-3">Catégorie</div>
                    <div className="col-span-3 text-right">Score Global</div>
                  </div>
                  
                  <div className="flex-1 overflow-hidden flex flex-col divide-y divide-slate-100">
                    {[
                      { rank: 1, name: "DataMinds", project: "Analyse prédictive", cat: "Innovation IA", score: "9.8/10", trend: "up" },
                      { rank: 2, name: "EcoTech Solutions", project: "Optimisation énergie", cat: "GreenTech", score: "9.5/10", trend: "same" },
                      { rank: 3, name: "HealthSync", project: "Suivi patient", cat: "HealthTech", score: "9.2/10", trend: "up" },
                      { rank: 4, name: "EduFuture", project: "Apprentissage adaptatif", cat: "EdTech", score: "8.9/10", trend: "down" },
                    ].map((row, i) => (
                      <div key={i} className="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-slate-50/50 transition-colors">
                        <div className="col-span-1 flex items-center gap-2">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-slate-200 text-slate-700' : i === 2 ? 'bg-orange-100 text-orange-700' : 'text-slate-500'}`}>
                            {row.rank}
                          </span>
                        </div>
                        <div className="col-span-5">
                          <div className="font-semibold text-slate-900">{row.name}</div>
                          <div className="text-sm text-slate-500">{row.project}</div>
                        </div>
                        <div className="col-span-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                            {row.cat}
                          </span>
                        </div>
                        <div className="col-span-3 text-right font-bold text-slate-900 flex items-center justify-end gap-2">
                          {row.score}
                          {row.trend === 'up' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>}
                          {row.trend === 'down' && <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>}
                          {row.trend === 'same' && <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
