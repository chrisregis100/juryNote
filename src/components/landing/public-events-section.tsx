import { MapPin, Users, Calendar, Tag } from "lucide-react";
import {
  ScaleIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  TrophyIcon,
  BuildingLibraryIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";
import { AnimatedSection } from "./animated-section";
import { ComponentType } from "react";

interface PublicEvent {
  name: string;
  date: string;
  category: string;
  categoryColor: string;
  location: string;
  participants: number;
  notes: number;
  status: "Archivé" | "Public" | "Résultats publiés";
  statusColor: string;
  icon: ComponentType<{ className?: string }>;
}

const PUBLIC_EVENTS: PublicEvent[] = [
  {
    name: "Concours National de Plaidoirie — Barreau de Paris",
    date: "14 mars 2025",
    category: "Concours juridique",
    categoryColor: "bg-indigo-100 text-indigo-700",
    location: "Paris, Palais de Justice",
    participants: 48,
    notes: 312,
    status: "Archivé",
    statusColor: "bg-slate-100 text-slate-600 border-slate-300",
    icon: ScaleIcon,
  },
  {
    name: "Arbitrage International ICC — Chambre de Commerce",
    date: "28 février 2025",
    category: "Arbitrage",
    categoryColor: "bg-rose-100 text-rose-700",
    location: "Paris, 8ème arrondissement",
    participants: 12,
    notes: 87,
    status: "Archivé",
    statusColor: "bg-slate-100 text-slate-600 border-slate-300",
    icon: GlobeAltIcon,
  },
  {
    name: "Concours Général de Droit — Sciences Po Paris",
    date: "19 janvier 2025",
    category: "Concours académique",
    categoryColor: "bg-emerald-100 text-emerald-700",
    location: "Paris, Sciences Po",
    participants: 124,
    notes: 748,
    status: "Résultats publiés",
    statusColor: "bg-emerald-100 text-emerald-700 border-emerald-300",
    icon: AcademicCapIcon,
  },
  {
    name: "Grand Prix de l'Innovation Juridique 2024",
    date: "5 décembre 2024",
    category: "Innovation",
    categoryColor: "bg-amber-100 text-amber-700",
    location: "Lyon, Cité Internationale",
    participants: 36,
    notes: 201,
    status: "Archivé",
    statusColor: "bg-slate-100 text-slate-600 border-slate-300",
    icon: TrophyIcon,
  },
  {
    name: "Concours de Procès Simulé — Université de Strasbourg",
    date: "22 novembre 2024",
    category: "Moot court",
    categoryColor: "bg-purple-100 text-purple-700",
    location: "Strasbourg, Faculté de Droit",
    participants: 64,
    notes: 429,
    status: "Résultats publiés",
    statusColor: "bg-emerald-100 text-emerald-700 border-emerald-300",
    icon: BuildingLibraryIcon,
  },
  {
    name: "Hackathon LegalTech — Station F",
    date: "9 novembre 2024",
    category: "Hackathon",
    categoryColor: "bg-orange-100 text-orange-700",
    location: "Paris, Station F",
    participants: 210,
    notes: 1340,
    status: "Public",
    statusColor: "bg-indigo-100 text-indigo-700 border-indigo-300",
    icon: LightBulbIcon,
  },
] as const;

export const PublicEventsSection = () => (
  <section id="public-events" className="bg-white px-6 py-20 md:py-28">
    <div className="mx-auto max-w-6xl">
      <AnimatedSection>
        <h2 className="text-center text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
          Déjà utilisé par les{" "}
          <span className="text-slate-900">meilleurs</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-slate-600">
          Des concours de plaidoirie aux hackathons juridiques — découvrez les
          événements publics déjà organisés sur JuryNote.
        </p>
      </AnimatedSection>

      <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {PUBLIC_EVENTS.map((event, i) => (
          <AnimatedSection key={event.name} delay={i * 0.07}>
            <div className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100 border border-slate-200">
                  <event.icon className="h-6 w-6 text-slate-700" />
                </div>
                <span
                  className={`mt-0.5 shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${event.statusColor}`}
                >
                  {event.status}
                </span>
              </div>

              {/* Title */}
              <h3 className="mt-4 text-sm font-semibold leading-snug text-slate-900">
                {event.name}
              </h3>

              {/* Category */}
              <div className="mt-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${event.categoryColor}`}
                >
                  <Tag className="h-3 w-3" aria-hidden="true" />
                  {event.category}
                </span>
              </div>

              {/* Meta */}
              <div className="mt-auto pt-4 space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Users className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>
                    <span className="font-semibold text-slate-900">
                      {event.participants}
                    </span>{" "}
                    participants ·{" "}
                    <span className="font-semibold text-slate-900">
                      {event.notes.toLocaleString("fr-FR")}
                    </span>{" "}
                    notes
                  </span>
                </div>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>

      <AnimatedSection delay={0.4}>
        <p className="mt-12 text-center text-sm text-slate-500">
          Et bien d&apos;autres événements encore —{" "}
          <span className="font-semibold text-slate-900">
            500+ organisés à ce jour
          </span>
        </p>
      </AnimatedSection>
    </div>
  </section>
);
