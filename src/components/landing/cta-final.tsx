import { AnimatedSection } from "./animated-section";
import { DemoForm } from "./demo-form";

export const CTAFinal = () => (
  <section
    id="demo"
    className="relative overflow-hidden border-t-2 border-black bg-[#0a0a0a] px-6 py-24 md:py-32"
  >
    {/* Decorative shapes */}
    <div
      className="absolute -left-6 top-12 h-24 w-24 rounded-full bg-indigo-600 opacity-50"
      aria-hidden="true"
    />
    <div
      className="absolute -right-4 bottom-16 h-20 w-20 rotate-12 bg-rose-500 opacity-40"
      aria-hidden="true"
    />
    <div
      className="absolute left-1/2 top-8 h-14 w-14 -rotate-6 border-4 border-yellow-400 opacity-40"
      aria-hidden="true"
    />

    <div className="relative mx-auto max-w-3xl text-center">
      <AnimatedSection>
        <h2 className="text-4xl font-black tracking-tight text-white md:text-6xl">
          Prêt à transformer
          <br />
          vos{" "}
          <span className="inline-block rotate-1 bg-yellow-400 px-3 text-black">
            jurys
          </span>{" "}
          ?
        </h2>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <p className="mx-auto mt-6 max-w-lg text-lg text-slate-400">
          Rejoignez les organisateurs qui ont déjà simplifié leur notation. Démo
          gratuite, sans engagement.
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
