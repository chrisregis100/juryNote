import { AnimatedSection } from "./animated-section";

const STEPS = [
  {
    number: "01",
    emoji: "📋",
    title: "Configurez votre événement",
    description:
      "Définissez vos critères de notation, préparez vos équipes, créez vos questions de check-in et paramétrez les ressources à distribuer.",
  },
  {
    number: "02",
    emoji: "📲",
    title: "Accueillez vos participants",
    description:
      "Partagez votre lien de check-in. Chaque participant valide sa présence et reçoit automatiquement ses ressources (clé API, accès, document).",
  },
  {
    number: "03",
    emoji: "🏆",
    title: "Notez, délibérez, publiez",
    description:
      "Les jurys notent depuis leur mobile avec leur code PIN. Suivez en direct, délibérez en équipe et publiez le classement final.",
  },
] as const;

export const HowItWorks = () => (
  <section id="how-it-works" className="dot-pattern-light bg-slate-50 px-6 py-20 md:py-28">
    <div className="mx-auto max-w-5xl">
      <AnimatedSection>
        <h2 className="text-center text-4xl font-black tracking-tight text-black md:text-5xl">
          Comment ça marche{" "}
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 text-2xl align-middle md:h-12 md:w-12 md:text-3xl">
            ?
          </span>
        </h2>
      </AnimatedSection>

      <div className="relative mt-16 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
        <div
          className="absolute left-[16.5%] right-[16.5%] top-14 hidden border-t-2 border-dashed border-slate-300 md:block"
          aria-hidden="true"
        />
        {STEPS.map((step, i) => (
          <AnimatedSection key={step.number} delay={i * 0.12}>
            <div className="relative flex flex-col items-center text-center">
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-8xl font-black text-indigo-500/10 select-none md:text-9xl">
                {step.number}
              </span>
              <div className="relative z-10 mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-black bg-white text-3xl shadow-[3px_3px_0_0_#0a0a0a]">
                {step.emoji}
              </div>
              <h3 className="relative z-10 text-xl font-bold text-black">{step.title}</h3>
              <p className="relative z-10 mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);
