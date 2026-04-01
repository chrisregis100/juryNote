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
      "Check-in participants (50 max)",
      "1 ressource distribuable",
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
      "Check-in participants illimité",
      "Ressources illimitées (API, liens, docs)",
      "Questions personnalisées au check-in",
      "Export participants CSV",
      "Délibération collaborative",
      "Dashboard participants en direct",
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
        <h2 className="text-center text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
          Des tarifs{" "}
          <span className="text-slate-900">simples</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-lg text-slate-600">
          Pas de frais cachés. Changez de plan quand vous voulez.
        </p>
      </AnimatedSection>

      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
        {PLANS.map((plan, i) => (
          <AnimatedSection key={plan.name} delay={i * 0.1}>
            <div
              className={`relative flex h-full flex-col rounded-xl border bg-white p-6 transition-all hover:shadow-md ${
                plan.highlighted
                  ? "border-slate-900 shadow-md shadow-slate-200"
                  : "border-slate-200 shadow-sm"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 right-4 inline-block rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                  Populaire
                </span>
              )}
              <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-slate-900 md:text-5xl">{plan.price}</span>
                {plan.period && (
                  <span className="text-sm text-slate-500">{plan.period}</span>
                )}
              </div>
              <p className="mt-2 text-sm text-slate-600">{plan.description}</p>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckIcon />
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href="#demo"
                className={`mt-8 inline-flex h-11 w-full items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  plan.highlighted
                    ? "bg-slate-900 text-white hover:bg-slate-800"
                    : "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
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
