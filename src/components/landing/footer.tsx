import Image from "next/image";
import Link from "next/link";

const PRODUCT_LINKS = [
  { label: "Fonctionnalités", href: "#features" },
  { label: "Tarifs", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Demander une démo", href: "#demo" },
] as const;

const LEGAL_LINKS = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Politique de confidentialité", href: "/politique-de-confidentialite" },
  { label: "CGU", href: "/cgu" },
  { label: "Politique de cookies", href: "/cookies" },
] as const;

export const Footer = () => (
  <footer className="bg-white border-t border-black/10">
    <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
      <div className="flex flex-col md:flex-row md:justify-between gap-12 md:gap-24">

        {/* Brand */}
        <div className="max-w-sm">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="juryNote logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="text-xl font-bold tracking-tight text-black">
              JuryNote
            </span>
          </div>
          <p className="mt-6 text-sm leading-relaxed text-black/50">
            La plateforme de notation et délibération pour hackathons et concours. 
            Organisez vos événements de manière professionnelle et transparente.
          </p>
        </div>

        {/* Links Container */}
        <div className="flex flex-col sm:flex-row gap-12 sm:gap-24">
          {/* Product links */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-black mb-6">
              Produit
            </h4>
            <ul className="space-y-4">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm font-medium text-black/50 transition-colors hover:text-black"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-black mb-6">
              Légal
            </h4>
            <ul className="space-y-4">
              {LEGAL_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm font-medium text-black/50 transition-colors hover:text-black"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

      <div className="mt-24 pt-8 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs font-medium text-black/40">
          &copy; {new Date().getFullYear()} JuryNote. Tous droits réservés.
        </p>
      </div>
    </div>
  </footer>
);
