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
    avatarBg: "bg-indigo-600",
    avatarText: "text-white",
  },
  {
    initials: "TR",
    name: "Thomas Remy",
    role: "Organisateur — HackStation F",
    quote:
      "On organisait un hackathon de 200 participants. Distribuer les clés API à l'arrivée était un cauchemar. Maintenant, chaque participant check-in et reçoit ses accès instantanément. Magique.",
    avatarBg: "bg-yellow-400",
    avatarText: "text-black",
  },
  {
    initials: "AC",
    name: "Aïcha Cissé",
    role: "Responsable concours — BPI France",
    quote:
      "Les classements automatiques, les critères pondérés et le check-in des participants nous font gagner un temps précieux. Outil indispensable.",
    avatarBg: "bg-emerald-500",
    avatarText: "text-white",
  },
];

export const Testimonials = () => (
  <section className="border-y-2 border-black bg-[#0a0a0a] px-6 py-20 md:py-28">
    <div className="mx-auto max-w-6xl">
      <AnimatedSection>
        <h2 className="text-center text-4xl font-black tracking-tight text-white md:text-5xl">
          Ils nous font{" "}
          <span className="inline-block -rotate-1 bg-yellow-400 px-2 text-black">confiance</span>
        </h2>
      </AnimatedSection>

      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <AnimatedSection key={t.name} delay={i * 0.1}>
            <div className="relative h-full rounded-lg border border-slate-700 bg-slate-900 p-6">
              <span
                className="absolute -top-3 left-5 font-serif text-6xl leading-none text-yellow-400 select-none"
                aria-hidden="true"
              >
                &ldquo;
              </span>
              <p className="mt-6 text-sm leading-relaxed text-slate-300 italic">{t.quote}</p>
              <div className="mt-6 flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${t.avatarBg} text-xs font-bold ${t.avatarText}`}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{t.name}</p>
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
