import { AnimatedSection } from "./animated-section";

const FEATURES_JOUR_J = [
  {
    emoji: "📲",
    title: "Check-in participants",
    description:
      "Générez un lien de check-in en 30 secondes. Vos participants s'enregistrent depuis leur mobile avec vos questions personnalisées.",
    bgColor: "bg-yellow-400",
  },
  {
    emoji: "🎁",
    title: "Distribution automatique de ressources",
    description:
      "Clés API, liens d'accès, documents secrets... Distribuez-les automatiquement à chaque check-in validé. Fini les emails manuels.",
    bgColor: "bg-indigo-500",
  },
  {
    emoji: "📊",
    title: "Dashboard participants en direct",
    description:
      "Suivez les arrivées en temps réel, consultez les réponses aux questions et exportez la liste des présents d'un clic.",
    bgColor: "bg-emerald-400",
  },
] as const;

const FEATURES_NOTATION = [
  {
    emoji: "⚡",
    title: "Notation temps réel",
    description:
      "Les notes apparaissent instantanément. Suivez la progression en direct depuis votre dashboard sans recharger la page.",
    bgColor: "bg-rose-500",
  },
  {
    emoji: "🎯",
    title: "Critères personnalisables",
    description:
      "Définissez vos propres critères, pondérations et échelles de notation. Chaque concours est unique.",
    bgColor: "bg-yellow-400",
  },
  {
    emoji: "🔑",
    title: "Accès jury sans compte",
    description:
      "Vos jurys se connectent en 10 secondes avec un simple code PIN. Aucun compte, aucun téléchargement.",
    bgColor: "bg-indigo-500",
  },
  {
    emoji: "🤝",
    title: "Délibération collaborative",
    description:
      "Discutez des résultats en équipe avec la vue délibération en temps réel. Verrouillez le classement final d'un clic.",
    bgColor: "bg-emerald-400",
  },
  {
    emoji: "🏆",
    title: "Classement & Export",
    description:
      "Les classements se calculent automatiquement selon vos pondérations. Exportez résultats et présences en un clic.",
    bgColor: "bg-rose-500",
  },
] as const;

export const Features = () => (
  <section id="features" className="bg-white px-6 py-20 md:py-28">
    <div className="mx-auto max-w-6xl">
      <AnimatedSection>
        <h2 className="text-center text-4xl font-black tracking-tight text-black md:text-5xl">
          Une plateforme{" "}
          <span className="inline-block -rotate-1 bg-yellow-400 px-2">complète</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-lg text-slate-600">
          Du premier participant qui arrive au classement final — tout se passe sur JuryNote.
        </p>
      </AnimatedSection>

      <AnimatedSection delay={0.05}>
        <div className="mt-14 flex items-center gap-3">
          <span className="inline-block rounded-md border-2 border-black bg-black px-3 py-1 text-xs font-black uppercase tracking-widest text-yellow-400">
            Jour J
          </span>
          <div className="h-0.5 flex-1 bg-slate-200" />
        </div>
      </AnimatedSection>

      <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-3">
        {FEATURES_JOUR_J.map((feature, i) => (
          <AnimatedSection key={feature.title} delay={0.08 + i * 0.08}>
            <div className="group h-full rounded-lg border-2 border-black bg-white p-6 shadow-[4px_4px_0_0_#0a0a0a] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#0a0a0a]">
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-md ${feature.bgColor} rotate-3 text-2xl`}>
                {feature.emoji}
              </div>
              <h3 className="text-lg font-bold text-black">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.description}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>

      <AnimatedSection delay={0.3}>
        <div className="mt-10 flex items-center gap-3">
          <span className="inline-block rounded-md border-2 border-black bg-black px-3 py-1 text-xs font-black uppercase tracking-widest text-indigo-400">
            Notation & Délibération
          </span>
          <div className="h-0.5 flex-1 bg-slate-200" />
        </div>
      </AnimatedSection>

      <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES_NOTATION.map((feature, i) => (
          <AnimatedSection key={feature.title} delay={0.35 + i * 0.08}>
            <div className="group h-full rounded-lg border-2 border-black bg-white p-6 shadow-[4px_4px_0_0_#0a0a0a] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#0a0a0a]">
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-md ${feature.bgColor} rotate-3 text-2xl`}>
                {feature.emoji}
              </div>
              <h3 className="text-lg font-bold text-black">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.description}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);
