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
    buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        firstLinkRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

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
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
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
          className={`h-0.5 w-6 bg-slate-700 transition-all duration-200 ${isOpen ? "translate-y-2 rotate-45" : ""}`}
        />
        <span
          className={`h-0.5 w-6 bg-slate-700 transition-all duration-200 ${isOpen ? "opacity-0" : ""}`}
        />
        <span
          className={`h-0.5 w-6 bg-slate-700 transition-all duration-200 ${isOpen ? "-translate-y-2 -rotate-45" : ""}`}
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
            className="fixed inset-y-0 right-0 z-40 w-72 border-l border-slate-200 bg-white/95 backdrop-blur-md px-8 pt-24 shadow-xl"
          >
            <ul className="flex flex-col gap-6">
              {links.map((link, index) => (
                <li key={link.href}>
                  <a
                    ref={index === 0 ? firstLinkRef : undefined}
                    href={link.href}
                    onClick={handleClose}
                    className="text-lg font-medium text-slate-700 transition-colors hover:text-slate-900"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#demo"
                  onClick={handleClose}
                  className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-slate-900 px-5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
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
            className="fixed inset-0 z-30 bg-slate-900/20 backdrop-blur-sm"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </div>
  );
};
