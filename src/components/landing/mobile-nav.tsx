"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MobileNavProps {
  links: readonly { label: string; href: string }[];
}

export const MobileNav = ({ links }: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => setIsOpen((prev) => !prev);
  const handleClose = useCallback(() => {
    setIsOpen(false);
    // Remettre le focus sur le bouton d'ouverture à la fermeture
    buttonRef.current?.focus();
  }, []);

  // Gestion du focus à l'ouverture : déplacer vers le premier lien
  useEffect(() => {
    if (isOpen) {
      // Petit délai pour laisser l'animation se terminer
      setTimeout(() => {
        firstLinkRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Fermeture avec la touche Échap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, handleClose]);

  // Focus trap optionnel : piéger le focus dans le menu
  useEffect(() => {
    if (!isOpen || !menuRef.current) return;

    const menu = menuRef.current;
    const focusableElements = menu.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        // Shift + Tab : si on est sur le premier élément, aller au dernier
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab : si on est sur le dernier élément, aller au premier
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    menu.addEventListener("keydown", handleTabKey);
    return () => {
      menu.removeEventListener("keydown", handleTabKey);
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
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
            ref={menuRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-40 w-72 border-l-2 border-black bg-white px-8 pt-24"
          >
            <ul className="flex flex-col gap-6">
              {links.map((link, index) => (
                <li key={link.href}>
                  <a
                    ref={index === 0 ? firstLinkRef : undefined}
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
