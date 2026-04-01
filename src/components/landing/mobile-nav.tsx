"use client";

import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

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

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Focus first link when menu opens (no setTimeout — element is in DOM when isOpen is true)
  useEffect(() => {
    if (isOpen) {
      firstLinkRef.current?.focus();
    }
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) handleClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, handleClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !menuRef.current) return;

    const menu = menuRef.current;
    const focusableElements = menu.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
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
    return () => menu.removeEventListener("keydown", handleTabKey);
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        onClick={handleToggle}
        aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        className="relative z-70 flex h-10 w-10 items-center justify-center text-slate-700 transition-colors hover:text-slate-900"
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
        ) : (
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop — sits above header (z-50) but below panel */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={handleClose}
              className="fixed inset-0 z-55 bg-slate-900/60 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Drawer panel — slides in from the right */}
            <motion.div
              id="mobile-menu"
              ref={menuRef}
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navigation"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              style={{
                paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
                paddingTop: "calc(6rem + env(safe-area-inset-top, 0px))",
              }}
              className="fixed inset-y-0 right-0 z-60 w-[85vw] max-w-sm border-l border-slate-800 bg-slate-900 px-8 shadow-2xl"
            >
              <ul className="flex flex-col gap-8">
                {links.map((link, index) => (
                  <li key={link.href}>
                    <a
                      ref={index === 0 ? firstLinkRef : undefined}
                      href={link.href}
                      onClick={handleClose}
                      className="text-lg font-medium text-slate-300 transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}

                <li className="border-t border-slate-700 pt-4">
                  <a
                    href="/login"
                    onClick={handleClose}
                    className="text-lg font-medium text-slate-300 transition-colors hover:text-white"
                  >
                    Connexion
                  </a>
                </li>

                <li>
                  <a
                    href="#demo"
                    onClick={handleClose}
                    className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-white px-5 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-100"
                  >
                    Demander une démo
                  </a>
                </li>
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
