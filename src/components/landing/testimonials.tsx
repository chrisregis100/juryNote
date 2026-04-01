import { AnimatedSection } from "./animated-section";

interface Testimonial {
  initials: string;
  name: string;
  role: string;
  quote: string;
  avatarBg: string;
  avatarText: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    initials: "SL",
    name: "Sophie Laurent",
    role: "Organisatrice — HackParis",
    quote:
      "On est passé de 3h de délibération chaotique à 30 minutes fluides. JuryNote a changé notre façon d'organiser nos hackathons.",
    avatarBg: "bg-slate-700",
    avatarText: "text-white",
  },
  {
    initials: "TR",
    name: "Thomas Remy",
    role: "Organisateur — HackStation F",
    quote:
      "On organisait un hackathon de 200 participants. Distribuer les clés API à l'arrivée était un cauchemar. Maintenant, chaque participant check-in et reçoit ses accès instantanément. Magique.",
    avatarBg: "bg-slate-600",
    avatarText: "text-white",
  },
  {
    initials: "AC",
    name: "Aïcha Cissé",
    role: "Responsable concours — BPI France",
    quote:
      "Les classements automatiques, les critères pondérés et le check-in des participants nous font gagner un temps précieux. Outil indispensable.",
    avatarBg: "bg-emerald-600",
    avatarText: "text-white",
  },
];

export const Testimonials = () => (
  <section className="border-y border-slate-200 bg-slate-50 px-6 py-20 md:py-28">
    <div className="mx-auto max-w-6xl">
      <AnimatedSection>
        <h2 className="text-center text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
          Ils nous font{" "}
          <span className="text-slate-900">confiance</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-lg text-slate-600">
          Des organisateurs de hackathons et concours qui ont adopté JuryNote.
        </p>
      </AnimatedSection>

      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <AnimatedSection key={t.name} delay={i * 0.1}>
            <div className="relative h-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <span
                className="absolute -top-3 left-5 font-serif text-6xl leading-none text-slate-200 select-none"
                aria-hidden="true"
              >
                &ldquo;
              </span>
              <p className="mt-6 text-sm leading-relaxed text-slate-600 italic">{t.quote}</p>
              <div className="mt-6 flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${t.avatarBg} text-xs font-bold ${t.avatarText}`}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);
