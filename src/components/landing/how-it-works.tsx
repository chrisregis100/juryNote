import {
  ClipboardDocumentListIcon,
  DevicePhoneMobileIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import { AnimatedSection } from "./animated-section";
import { ComponentType } from "react";

const STEPS: {
  number: string;
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
}[] = [
  {
    number: "01",
    icon: ClipboardDocumentListIcon,
    title: "Configurez votre événement",
    description:
      "Définissez vos critères de notation, préparez vos équipes, créez vos questions de check-in et paramétrez les ressources à distribuer.",
  },
  {
    number: "02",
    icon: DevicePhoneMobileIcon,
    title: "Accueillez vos participants",
    description:
      "Partagez votre lien de check-in. Chaque participant valide sa présence et reçoit automatiquement ses ressources (clé API, accès, document).",
  },
  {
    number: "03",
    icon: TrophyIcon,
    title: "Notez, délibérez, publiez",
    description:
      "Les jurys notent depuis leur mobile avec leur code PIN. Suivez en direct, délibérez en équipe et publiez le classement final.",
  },
] as const;

export const HowItWorks = () => (
  <section id="how-it-works" className="bg-white px-6 py-20 md:py-28">
    <div className="mx-auto max-w-5xl">
      <AnimatedSection>
        <h2 className="text-center text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
          Comment ça marche ?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-lg text-slate-600">
          Trois étapes suffisent pour lancer votre événement de A à Z.
        </p>
      </AnimatedSection>

      <div className="relative mt-16 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
        <div
          className="absolute left-[16.5%] right-[16.5%] top-24 hidden border-t border-dashed border-slate-300 md:block"
          aria-hidden="true"
        />
        {STEPS.map((step, i) => (
          <AnimatedSection key={step.number} delay={i * 0.12}>
            <div className="relative flex flex-col items-center text-center pt-16">
              <span
                className="absolute -top-12 left-1/2 -translate-x-1/2 text-[140px] font-bold text-slate-100 select-none leading-none pointer-events-none"
                aria-hidden="true"
              >
                {step.number}
              </span>
              <div className="relative z-10 mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-slate-100 shadow-md">
                <step.icon className="h-8 w-8 text-slate-700" />
              </div>
              <h3 className="relative z-10 text-xl font-semibold text-slate-900">{step.title}</h3>
              <p className="relative z-10 mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);
