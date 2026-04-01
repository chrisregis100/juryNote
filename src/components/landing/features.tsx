import {
  BoltIcon,
  ChartBarIcon,
  DevicePhoneMobileIcon,
  GiftIcon,
  HandThumbUpIcon,
  KeyIcon,
  TagIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import { ComponentType } from "react";
import { AnimatedSection } from "./animated-section";

interface Feature {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const FEATURES_JOUR_J: Feature[] = [
  {
    icon: DevicePhoneMobileIcon,
    title: "Check-in participants",
    description:
      "Générez un lien de check-in en 30 secondes. Vos participants s'enregistrent depuis leur mobile avec vos questions personnalisées.",
  },
  {
    icon: GiftIcon,
    title: "Distribution automatique de ressources",
    description:
      "Clés API, liens d'accès, documents secrets... Distribuez-les automatiquement à chaque check-in validé. Fini les emails manuels.",
  },
  {
    icon: ChartBarIcon,
    title: "Dashboard participants en direct",
    description:
      "Suivez les arrivées en temps réel, consultez les réponses aux questions et exportez la liste des présents d'un clic.",
  },
] as const;

const FEATURES_NOTATION: Feature[] = [
  {
    icon: BoltIcon,
    title: "Notation temps réel",
    description:
      "Les notes apparaissent instantanément. Suivez la progression en direct depuis votre dashboard sans recharger la page.",
  },
  {
    icon: TagIcon,
    title: "Critères personnalisables",
    description:
      "Définissez vos propres critères, pondérations et échelles de notation. Chaque concours est unique.",
  },
  {
    icon: KeyIcon,
    title: "Accès jury sans compte",
    description:
      "Vos jurys se connectent en 10 secondes avec un simple code PIN. Aucun compte, aucun téléchargement.",
  },
  {
    icon: HandThumbUpIcon,
    title: "Délibération collaborative",
    description:
      "Discutez des résultats en équipe avec la vue délibération en temps réel. Verrouillez le classement final d'un clic.",
  },
  {
    icon: TrophyIcon,
    title: "Classement & Export",
    description:
      "Les classements se calculent automatiquement selon vos pondérations. Exportez résultats et présences en un clic.",
  },
] as const;

export const Features = () => (
  <section id="features" className="bg-slate-50 px-6 py-20 md:py-28">
    <div className="mx-auto max-w-6xl">
      <AnimatedSection>
        <h2 className="text-center text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
          Une plateforme <span className="text-slate-900">complète</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-lg text-slate-600">
          Du premier participant qui arrive au classement final — tout se passe
          sur JuryNote.
        </p>
      </AnimatedSection>

      <AnimatedSection delay={0.05}>
        <div className="mt-14 flex items-center gap-3">
          <span className="inline-block rounded-md bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white">
            Jour J
          </span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>
      </AnimatedSection>

      <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-3">
        {FEATURES_JOUR_J.map((feature, i) => (
          <AnimatedSection key={feature.title} delay={0.08 + i * 0.08}>
            <div className="group h-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div
                className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100`}
              >
                <feature.icon className="h-6 w-6 text-slate-700" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {feature.description}
              </p>
            </div>
          </AnimatedSection>
        ))}
      </div>

      <AnimatedSection delay={0.3}>
        <div className="mt-10 flex items-center gap-3">
          <span className="inline-block rounded-md bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white">
            Notation &amp; Délibération
          </span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>
      </AnimatedSection>

      <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES_NOTATION.map((feature, i) => (
          <AnimatedSection key={feature.title} delay={0.35 + i * 0.08}>
            <div className="group h-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div
                className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100`}
              >
                <feature.icon className="h-6 w-6 text-slate-700" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {feature.description}
              </p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);
