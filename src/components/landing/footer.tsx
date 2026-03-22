import Link from "next/link";

export const Footer = () => (
  <footer className="bg-[#0a0a0a] px-6 pb-8 pt-12">
    <div className="mx-auto max-w-6xl">
      <div className="border-t border-slate-800 pt-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <span className="flex items-center gap-2 text-lg font-black text-white">
              <span className="inline-block h-3 w-3 rotate-6 bg-indigo-600" />
              JuryFlow
            </span>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              La plateforme de notation et délibération pour hackathons et
              concours.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Produit
            </h4>
            <ul className="mt-3 space-y-2">
              {[
                { label: "Fonctionnalités", href: "#features" },
                { label: "Tarifs", href: "#pricing" },
                { label: "FAQ", href: "#faq" },
                { label: "Demander une démo", href: "#demo" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-500 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Légal
            </h4>
            <ul className="mt-3 space-y-2">
              {[
                { label: "Mentions légales", href: "/mentions-legales" },
                {
                  label: "Politique de confidentialité",
                  href: "/politique-de-confidentialite",
                },
                { label: "CGU", href: "/cgu" },
                { label: "Politique de cookies", href: "/cookies" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-500 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-slate-800 pt-6 text-center text-xs text-slate-600">
        &copy; {new Date().getFullYear()} JuryFlow. Tous droits réservés.
      </div>
    </div>
  </footer>
);
