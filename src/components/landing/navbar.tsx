import Image from "next/image";
import Link from "next/link";
import { MobileNav } from "./mobile-nav";

const NAV_LINKS = [
  { label: "Fonctionnalités", href: "#features" },
  { label: "Comment ça marche", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
] as const;

export const Navbar = () => (
  <header className="sticky top-0 z-50 border-b border-slate-200/50 bg-white/80 backdrop-blur-md">
    <nav
      className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6"
      aria-label="Navigation principale"
    >
      <Link
        href="/"
        className="flex items-center gap-2"
        aria-label="JuryNote - Accueil"
      >
        <Image
          src="/logo.png"
          alt="juryNote logo"
          width={32}
          height={32}
          className="rounded-lg"
        />
        <span className="text-xl font-semibold tracking-tight text-slate-900">
          JuryNote
        </span>
      </Link>

      <ul className="hidden items-center gap-8 md:flex">
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="hidden items-center gap-4 md:flex">
        <a
          href="#demo"
          className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
        >
          Connexion
        </a>
        <a
          href="#demo"
          className="inline-flex h-10 items-center rounded-lg bg-slate-900 px-5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
        >
          Demander une démo
        </a>
      </div>

      <MobileNav links={NAV_LINKS} />
    </nav>
  </header>
);
