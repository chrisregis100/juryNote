"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MobileNavProps {
  links: readonly { label: string; href: string }[];
}

export const MobileNav = ({ links }: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen((prev) => !prev);
  const handleClose = () => setIsOpen(false);

  return (
    <div className="md:hidden">
      <button
        onClick={handleToggle}
        aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={isOpen}
        className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5"
      >
        <span
          className={`h-0.5 w-6 bg-black transition-all duration-200 ${isOpen ? "translate-y-2 rotate-45" : ""}`}
        />
        <span
          className={`h-0.5 w-6 bg-black transition-all duration-200 ${isOpen ? "opacity-0" : ""}`}
        />
        <span
          className={`h-0.5 w-6 bg-black transition-all duration-200 ${isOpen ? "-translate-y-2 -rotate-45" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-40 w-72 border-l-2 border-black bg-white px-8 pt-24"
          >
            <ul className="flex flex-col gap-6">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={handleClose}
                    className="text-lg font-bold text-black hover:underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#demo"
                  onClick={handleClose}
                  className="inline-flex h-12 w-full items-center justify-center rounded-md border-2 border-black bg-black px-5 text-sm font-bold text-white shadow-[3px_3px_0_0_#4f46e5]"
                >
                  Demander une démo
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-30 bg-black/20"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </div>
  );
};
