import { AnimatedSection } from "./animated-section";

const FEATURES = [
  {
    emoji: "⚡",
    title: "Notation temps réel",
    description:
      "Les notes apparaissent instantanément. Suivez la progression en direct depuis votre dashboard.",
    bgColor: "bg-yellow-400",
  },
  {
    emoji: "🎯",
    title: "Critères personnalisables",
    description:
      "Définissez vos propres critères, pondérations et échelles de notation. Chaque concours est unique.",
    bgColor: "bg-indigo-500",
  },
  {
    emoji: "🔑",
    title: "Accès jury par code PIN",
    description:
      "Vos jurys se connectent en 10 secondes avec un simple code PIN. Aucun compte nécessaire.",
    bgColor: "bg-rose-500",
  },
  {
    emoji: "🤝",
    title: "Délibération collaborative",
    description:
      "Discutez des résultats en équipe avec la vue délibération en temps réel.",
    bgColor: "bg-emerald-400",
  },
  {
    emoji: "🏆",
    title: "Classement automatique",
    description:
      "Les classements se calculent automatiquement selon vos pondérations. Fini les tableurs.",
    bgColor: "bg-yellow-400",
  },
  {
    emoji: "📊",
    title: "Export des résultats",
    description:
      "Exportez vos résultats en un clic. Partagez les classements avec tous les participants.",
    bgColor: "bg-indigo-500",
  },
] as const;

export const Features = () => (
  <section id="features" className="bg-white px-6 py-20 md:py-28">
    <div className="mx-auto max-w-6xl">
      <AnimatedSection>
        <h2 className="text-center text-4xl font-black tracking-tight text-black md:text-5xl">
          Tout ce qu&apos;il vous{" "}
          <span className="inline-block -rotate-1 bg-yellow-400 px-2">
            faut
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-lg text-slate-600">
          Une plateforme complète pour gérer la notation de A à Z.
        </p>
      </AnimatedSection>

      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, i) => (
          <AnimatedSection key={feature.title} delay={i * 0.08}>
            <div className="group h-full rounded-lg border-2 border-black bg-white p-6 shadow-[4px_4px_0_0_#0a0a0a] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#0a0a0a]">
              <div
                className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-md ${feature.bgColor} rotate-3 text-2xl`}
              >
                {feature.emoji}
              </div>
              <h3 className="text-lg font-bold text-black">{feature.title}</h3>
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
