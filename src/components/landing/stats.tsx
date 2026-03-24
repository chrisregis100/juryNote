import { AnimatedSection } from "./animated-section";

const STATS = [
  { value: "500+", label: "Événements organisés" },
  { value: "10k+", label: "Participants enregistrés" },
  { value: "3", label: "Rôles (Admin, Superviseur, Jury)" },
  { value: "2 min", label: "De setup" },
] as const;

export const Stats = () => (
  <section className="border-y-2 border-black bg-[#0a0a0a] px-6 py-16 md:py-20">
    <div className="mx-auto max-w-5xl">
      <AnimatedSection>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-0">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col items-center gap-2 ${i < STATS.length - 1 ? "md:border-r md:border-slate-700" : ""}`}
            >
              <span className="text-4xl font-black text-white md:text-5xl">{stat.value}</span>
              <span className="text-xs font-medium uppercase tracking-widest text-slate-400 text-center">{stat.label}</span>
            </div>
          ))}
        </div>
      </AnimatedSection>
    </div>
  </section>
);
