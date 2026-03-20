"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedSection } from "./animated-section";

const FAQ_ITEMS = [
  {
    question: "Faut-il créer un compte pour les jurys ?",
    answer:
      "Non. Chaque jury reçoit un code PIN unique et se connecte directement depuis son navigateur. Aucun compte, aucun téléchargement.",
  },
  {
    question: "Combien de jurys peuvent noter en même temps ?",
    answer:
      "Il n'y a aucune limite technique. Nous avons testé avec plus de 50 jurys simultanés sans aucun problème de performance.",
  },
  {
    question: "Peut-on personnaliser les critères de notation ?",
    answer:
      "Absolument. Vous définissez vos propres critères, choisissez l'échelle (sur 5, 10 ou 20) et attribuez des pondérations différentes à chaque critère.",
  },
  {
    question: "Les données sont-elles sécurisées ?",
    answer:
      "Oui. Toutes les données sont chiffrées en transit et au repos. Nous utilisons des serveurs en Europe et respectons le RGPD.",
  },
  {
    question: "Puis-je exporter les résultats ?",
    answer:
      "Oui, vous pouvez exporter les classements et les notes détaillées. L'export avancé avec filtres est disponible sur le plan Pro.",
  },
  {
    question: "Y a-t-il une période d'essai ?",
    answer:
      "Le plan Gratuit est disponible sans limite de temps. Pour le plan Pro, vous pouvez demander une démo et bénéficier d'un essai de 14 jours.",
  },
] as const;

const FAQItem = ({
  question,
  answer,
  index,
}: {
  question: string;
  answer: string;
  index: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const accordionId = `faq-accordion-${index}`;

  const handleToggle = () => setIsOpen((prev) => !prev);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <AnimatedSection delay={index * 0.06}>
      <div className="border-2 border-black bg-white shadow-[3px_3px_0_0_#0a0a0a]">
        <button
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          aria-expanded={isOpen}
          aria-controls={accordionId}
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
        >
          <span className="text-sm font-bold text-black md:text-base">
            {question}
          </span>
          <motion.span
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border-2 border-black text-lg font-bold leading-none"
            aria-hidden="true"
          >
            +
          </motion.span>
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id={accordionId}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <p className="px-5 pb-4 text-sm leading-relaxed text-slate-600">
                {answer}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedSection>
  );
};

export const FAQ = () => (
  <section id="faq" className="dot-pattern-light bg-slate-50 px-6 py-20 md:py-28">
    <div className="mx-auto max-w-2xl">
      <AnimatedSection>
        <h2 className="text-center text-4xl font-black tracking-tight text-black md:text-5xl">
          Questions fréquentes
        </h2>
      </AnimatedSection>

      <div className="mt-12 space-y-4">
        {FAQ_ITEMS.map((item, i) => (
          <FAQItem
            key={item.question}
            question={item.question}
            answer={item.answer}
            index={i}
          />
        ))}
      </div>
    </div>
  </section>
);
