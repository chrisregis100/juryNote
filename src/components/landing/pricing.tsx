import { AnimatedSection } from "./animated-section";

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}

const PLANS: PricingPlan[] = [
  {
    name: "Gratuit",
    price: "0€",
    period: "pour toujours",
    description: "Parfait pour tester avec un petit événement.",
    features: [
      "1 événement",
      "5 jurys max",
      "3 critères max",
      "Classement automatique",
      "Export basique",
    ],
    cta: "Commencer gratuitement",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "29€",
    period: "/ mois",
    description: "Pour les organisateurs réguliers.",
    features: [
      "Événements illimités",
      "Jurys illimités",
      "Critères illimités",
      "Délibération collaborative",
      "Export avancé",
      "Support prioritaire",
    ],
    cta: "Demander une démo",
    highlighted: true,
  },
  {
    name: "Entreprise",
    price: "Sur mesure",
    period: "",
    description: "Pour les grandes organisations.",
    features: [
      "Tout du plan Pro",
      "SSO / SAML",
      "API dédiée",
      "Accompagnement personnalisé",
      "SLA garanti",
      "Facturation annuelle",
    ],
    cta: "Nous contacter",
    highlighted: false,
  },
];

const CheckIcon = () => (
  <svg
    className="h-4 w-4 shrink-0 text-emerald-500"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M3 8.5L6.5 12L13 4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Pricing = () => (
  <section id="pricing" className="bg-white px-6 py-20 md:py-28">
    <div className="mx-auto max-w-6xl">
      <AnimatedSection>
        <h2 className="text-center text-4xl font-black tracking-tight text-black md:text-5xl">
          Des tarifs{" "}
          <span className="inline-block -rotate-1 bg-yellow-400 px-2">
            simples
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-lg text-slate-600">
          Pas de frais cachés. Changez de plan quand vous voulez.
        </p>
      </AnimatedSection>

      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
        {PLANS.map((plan, i) => (
          <AnimatedSection key={plan.name} delay={i * 0.1}>
            <div
              className={`relative flex h-full flex-col rounded-lg border-2 bg-white p-6 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 ${
                plan.highlighted
                  ? "border-indigo-600 shadow-[6px_6px_0_0_#4f46e5] hover:shadow-[8px_8px_0_0_#4f46e5]"
                  : "border-black shadow-[4px_4px_0_0_#0a0a0a] hover:shadow-[6px_6px_0_0_#0a0a0a]"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 right-4 inline-block rotate-2 rounded-sm bg-yellow-400 px-3 py-1 text-xs font-bold text-black">
                  Populaire
                </span>
              )}

              <h3 className="text-lg font-bold text-black">{plan.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-black text-black md:text-5xl">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-sm text-slate-600">{plan.period}</span>
                )}
              </div>
              <p className="mt-2 text-sm text-slate-600">{plan.description}</p>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-slate-700"
                  >
                    <CheckIcon />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="#demo"
                className={`mt-8 inline-flex h-11 w-full items-center justify-center rounded-md border-2 text-sm font-bold transition-all ${
                  plan.highlighted
                    ? "border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700"
                    : "border-black bg-white text-black hover:bg-slate-50"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);
