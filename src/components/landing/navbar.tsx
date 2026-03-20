import Link from "next/link";
import { MobileNav } from "./mobile-nav";

const NAV_LINKS = [
  { label: "Fonctionnalités", href: "#features" },
  { label: "Comment ça marche", href: "#how-it-works" },
  { label: "Tarifs", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
] as const;

export const Navbar = () => (
  <header className="sticky top-0 z-50 border-b-2 border-black bg-white">
    <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6" aria-label="Navigation principale">
      <Link
        href="/"
        className="flex items-center gap-2 text-xl font-black tracking-tight"
        aria-label="JuryFlow - Accueil"
      >
        <span className="inline-block h-4 w-4 rotate-6 bg-indigo-600" />
        JuryFlow
      </Link>

      <ul className="hidden items-center gap-8 md:flex">
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="text-sm font-medium text-slate-700 transition-colors hover:text-black hover:underline hover:underline-offset-4"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="hidden md:block">
        <a
          href="#demo"
          className="inline-flex h-10 items-center rounded-md border-2 border-black bg-black px-5 text-sm font-bold text-white shadow-[3px_3px_0_0_#4f46e5] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_#4f46e5]"
        >
          Demander une démo
        </a>
      </div>

      <MobileNav links={NAV_LINKS} />
    </nav>
  </header>
);
