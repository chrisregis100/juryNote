import { AnimatedSection } from "./animated-section";
import { DemoForm } from "./demo-form";

const FEATURES = [
  "Inscription en 2 minutes",
  "Tableau de bord en temps réel",
  "Export PDF & CSV inclus",
] as const;

export const CTAFinal = () => (
  <section id="demo" className="relative bg-white">
    <div className="h-px bg-black" aria-hidden="true" />

    <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
      <div className="grid gap-16 lg:grid-cols-[1fr_480px] lg:gap-20 items-start">

        {/* Left: copy */}
        <AnimatedSection>
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-black/40 mb-8 block">
            Essai gratuit · Sans engagement
          </span>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-black tracking-tight leading-none mb-8">
            Prêt à organiser votre prochain concours ?
          </h2>
          <p className="text-base text-black/50 max-w-sm leading-relaxed mb-10">
            Du check-in à la remise des prix — lancez votre événement en 5 minutes. Démo gratuite, sans engagement.
          </p>
          <ul className="space-y-3" aria-label="Fonctionnalités incluses">
            {FEATURES.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-black/70">
                <span className="w-4 h-px bg-black/30 shrink-0" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </AnimatedSection>

        {/* Right: form card */}
        <AnimatedSection delay={0.15}>
          <div className="bg-black rounded-2xl p-8 md:p-10 lg:sticky lg:top-24">
            <DemoForm />
          </div>
        </AnimatedSection>

      </div>
    </div>
  </section>
);
