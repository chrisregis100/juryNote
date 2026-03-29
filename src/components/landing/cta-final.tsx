import { AnimatedSection } from "./animated-section";
import { DemoForm } from "./demo-form";

export const CTAFinal = () => (
  <section
    id="demo"
    className="relative overflow-hidden bg-slate-900 px-6 py-24 md:py-32"
  >
    {/* Subtle decorative glow elements */}
    <div
      className="absolute -left-16 top-0 h-64 w-64 rounded-full bg-white/5 blur-3xl"
      aria-hidden="true"
    />
    <div
      className="absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-white/5 blur-3xl"
      aria-hidden="true"
    />

    <div className="relative mx-auto max-w-3xl text-center">
      <AnimatedSection>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-slate-300 text-sm font-medium mb-8">
          <span className="flex h-2 w-2 rounded-full bg-slate-400" aria-hidden="true" />
          Essai gratuit, sans engagement
        </div>
        <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
          Prêt à organiser votre prochain concours ?
        </h2>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <p className="mx-auto mt-6 max-w-lg text-lg text-slate-400">
          Du check-in à la remise des prix — lancez votre événement en 5 minutes. Démo gratuite, sans engagement.
        </p>
      </AnimatedSection>

      <AnimatedSection delay={0.2}>
        <div className="mt-10">
          <DemoForm />
        </div>
      </AnimatedSection>
    </div>
  </section>
);
