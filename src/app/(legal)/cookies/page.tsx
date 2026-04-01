import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politique de cookies | JuryNote",
  description:
    "Politique de cookies de JuryNote — quels cookies sont utilisés, pourquoi et comment les gérer.",
};

export const dynamic = "force-static";
export const revalidate = false;

const LAST_UPDATED = "22 mars 2026";

interface SectionProps {
  number: string;
  title: string;
  children: React.ReactNode;
}

const Section = ({ number, title, children }: SectionProps) => (
  <div id={`section-${number}`}>
    <div className="mb-4 flex items-baseline gap-3">
      <span className="text-3xl font-black text-indigo-600 opacity-30">
        {number}
      </span>
      <h2 className="text-2xl font-black text-[#0a0a0a]">{title}</h2>
    </div>
    <div className="rounded-lg border-2 border-black bg-white p-6 shadow-[4px_4px_0_0_#0a0a0a]">
      {children}
    </div>
  </div>
);

interface CookieRowProps {
  name: string;
  type: string;
  purpose: string;
  duration: string;
  essential: boolean;
}

const CookieRow = ({
  name,
  type,
  purpose,
  duration,
  essential,
}: CookieRowProps) => (
  <tr className="border-b border-slate-100">
    <td className="py-3 pr-3 align-top">
      <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono text-indigo-700">
        {name}
      </code>
    </td>
    <td className="py-3 pr-3 align-top text-xs text-slate-600">{type}</td>
    <td className="py-3 pr-3 align-top text-xs text-slate-600">{purpose}</td>
    <td className="py-3 pr-3 align-top text-xs text-slate-500">{duration}</td>
    <td className="py-3 align-top">
      <span
        className={`inline-block rounded px-2 py-0.5 text-xs font-bold ${
          essential
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {essential ? "Nécessaire" : "Fonctionnel"}
      </span>
    </td>
  </tr>
);

export default function CookiesPage() {
  return (
    <>
      {/* Hero */}
      <section className="dot-pattern bg-[#0a0a0a] px-6 py-14">
        <div className="mx-auto max-w-3xl">
          <nav aria-label="Fil d'Ariane" className="mb-6">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-slate-400 transition-colors hover:text-white"
                >
                  Accueil
                </Link>
              </li>
              <li className="text-slate-600">/</li>
              <li className="text-slate-300">Politique de cookies</li>
            </ol>
          </nav>
          <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">
            Politique de cookies
          </h1>
          <p className="mt-3 text-slate-400">
            Dernière mise à jour :{" "}
            <time dateTime="2026-03-22">{LAST_UPDATED}</time>
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-3xl space-y-12">
          {/* Intro */}
          <div className="rounded-lg border-2 border-yellow-400 bg-yellow-50 p-5">
            <p className="text-sm leading-relaxed text-slate-700">
              La présente politique de cookies explique ce que sont les cookies,
              lesquels sont utilisés par <strong>JuryNote</strong>, pourquoi
              nous les utilisons et comment vous pouvez les gérer. Elle complète
              notre{" "}
              <Link
                href="/politique-de-confidentialite"
                className="font-medium text-indigo-600 hover:underline"
              >
                Politique de confidentialité
              </Link>
              .
            </p>
          </div>

          {/* Section 1 - Qu&apos;est-ce qu&apos;un cookie */}
          <Section number="01" title="Qu'est-ce qu'un cookie ?">
            <p className="text-sm leading-relaxed text-slate-600">
              Un cookie est un petit fichier texte déposé sur votre terminal
              (ordinateur, tablette, smartphone) par le serveur d&apos;un site
              web lorsque vous le visitez. Il permet au site de reconnaître
              votre navigateur lors de vos visites ultérieures, de mémoriser vos
              préférences ou de maintenir votre session de connexion active.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Les cookies peuvent être :
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                {
                  type: "Cookies de session",
                  desc: "Supprimés dès la fermeture de votre navigateur.",
                },
                {
                  type: "Cookies persistants",
                  desc: "Conservés sur votre terminal jusqu&apos;à leur date d&apos;expiration ou leur suppression manuelle.",
                },
                {
                  type: "Cookies propriétaires",
                  desc: "Déposés directement par JuryNote.",
                },
                {
                  type: "Cookies tiers",
                  desc: "Déposés par des services externes (ex. : hébergeur, service d&apos;analyse).",
                },
              ].map(({ type, desc }) => (
                <li
                  key={type}
                  className="flex gap-3 rounded-md bg-slate-50 p-3 text-slate-600"
                >
                  <span className="mt-0.5 h-2 w-2 shrink-0 rotate-45 bg-indigo-600" />
                  <span>
                    <strong className="text-slate-800">{type} :</strong> {desc}
                  </span>
                </li>
              ))}
            </ul>
          </Section>

          {/* Section 2 - Cookies utilisés */}
          <Section number="02" title="Cookies utilisés par JuryNote">
            <p className="mb-4 text-sm leading-relaxed text-slate-600">
              JuryNote utilise exclusivement des cookies strictement nécessaires
              au fonctionnement de la plateforme.{" "}
              <strong>Aucun cookie publicitaire ni de traçage marketing</strong>{" "}
              n&apos;est déposé sur votre terminal.
            </p>

            {/* Desktop table */}
            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-black">
                    <th className="pb-2 pr-3 text-left text-xs font-bold text-slate-700">
                      Nom
                    </th>
                    <th className="pb-2 pr-3 text-left text-xs font-bold text-slate-700">
                      Type
                    </th>
                    <th className="pb-2 pr-3 text-left text-xs font-bold text-slate-700">
                      Finalité
                    </th>
                    <th className="pb-2 pr-3 text-left text-xs font-bold text-slate-700">
                      Durée
                    </th>
                    <th className="pb-2 text-left text-xs font-bold text-slate-700">
                      Catégorie
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <CookieRow
                    name="better-auth.session_token"
                    type="Propriétaire — HttpOnly, Secure"
                    purpose="Maintien de la session de connexion de l'organisateur ou du superviseur. Contient un token de session opaque (non lisible par JavaScript)."
                    duration="30 jours (renouvelé à chaque activité)"
                    essential
                  />
                  <CookieRow
                    name="better-auth.session_data"
                    type="Propriétaire — HttpOnly, Secure"
                    purpose="Stocke les informations de session côté client (rôle, identifiant) pour éviter des requêtes serveur superflues."
                    duration="30 jours"
                    essential
                  />
                  <CookieRow
                    name="better-auth.dont_remember"
                    type="Propriétaire — Session"
                    purpose="Indique si l'utilisateur a choisi de ne pas être mémorisé pour raccourcir la durée de sa session."
                    duration="Session (supprimé à la fermeture du navigateur)"
                    essential
                  />
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="space-y-4 sm:hidden">
              {[
                {
                  name: "better-auth.session_token",
                  type: "Propriétaire — HttpOnly, Secure",
                  purpose:
                    "Maintien de la session de connexion. Token opaque, non lisible par JavaScript.",
                  duration: "30 jours",
                },
                {
                  name: "better-auth.session_data",
                  type: "Propriétaire — HttpOnly, Secure",
                  purpose:
                    "Informations de session (rôle, identifiant) pour éviter des requêtes serveur superflues.",
                  duration: "30 jours",
                },
                {
                  name: "better-auth.dont_remember",
                  type: "Propriétaire — Session",
                  purpose:
                    "Indique si l&apos;utilisateur souhaite une session courte.",
                  duration: "Session",
                },
              ].map((cookie) => (
                <div
                  key={cookie.name}
                  className="rounded-md border border-slate-200 bg-slate-50 p-4"
                >
                  <code className="rounded bg-white px-1.5 py-0.5 text-xs font-mono text-indigo-700 shadow-sm">
                    {cookie.name}
                  </code>
                  <p className="mt-2 text-xs text-slate-500">{cookie.type}</p>
                  <p className="mt-1.5 text-sm text-slate-600">
                    {cookie.purpose}
                  </p>
                  <p className="mt-1.5 text-xs text-slate-500">
                    Durée :{" "}
                    <span className="font-medium">{cookie.duration}</span>
                  </p>
                  <span className="mt-2 inline-block rounded bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">
                    Nécessaire
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-md border-l-4 border-green-500 bg-green-50 p-4 text-sm text-slate-700">
              <strong>Aucun cookie tiers, publicitaire ou analytique</strong>{" "}
              n&apos;est utilisé par JuryNote. Nous ne partageons aucune donnée
              de navigation avec des réseaux publicitaires ou des plateformes
              d&apos;analyse tierces.
            </div>
          </Section>

          {/* Section 3 - Base légale */}
          <Section number="03" title="Base légale et consentement">
            <p className="text-sm leading-relaxed text-slate-600">
              Les cookies utilisés par JuryNote sont{" "}
              <strong>strictement nécessaires</strong> au fonctionnement du
              service d&apos;authentification. À ce titre, conformément à la{" "}
              <strong>Loi N°2009-09 du 22 mai 2009</strong> (art. 5) et à
              l&apos;
              <strong>Acte Additionnel CEDEAO A/SA.1/01/10</strong>, leur dépôt
              est fondé sur la base légale de l&apos;
              <strong>exécution du contrat</strong> (accès au service) et de
              l&apos;
              <strong>intérêt légitime</strong> (sécurité de la session).
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Ces cookies ne nécessitent pas votre consentement préalable car
              ils sont indispensables à la fourniture du service que vous
              demandez (connexion sécurisée, maintien de la session). Refuser
              ces cookies empêcherait l&apos;accès aux fonctionnalités de la
              plateforme nécessitant une authentification.
            </p>
          </Section>

          {/* Section 4 - Durée */}
          <Section number="04" title="Durée de conservation des cookies">
            <p className="text-sm leading-relaxed text-slate-600">
              Les cookies de session de JuryNote sont conservés pour une durée
              maximale de <strong>30 jours</strong> à compter de la dernière
              activité de l&apos;utilisateur sur la plateforme. Cette durée est
              conforme aux exigences de sécurité et aux standards de
              l&apos;industrie pour les applications B2B.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Les cookies de session (without &quot;remember me&quot;) sont
              supprimés dès la fermeture du navigateur.
            </p>
          </Section>

          {/* Section 5 - Gestion */}
          <Section number="05" title="Comment gérer vos cookies">
            <p className="mb-4 text-sm leading-relaxed text-slate-600">
              Vous pouvez à tout moment contrôler et gérer les cookies via les
              paramètres de votre navigateur. Voici les liens vers les guides
              des principaux navigateurs :
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                {
                  browser: "Google Chrome",
                  url: "https://support.google.com/chrome/answer/95647",
                },
                {
                  browser: "Mozilla Firefox",
                  url: "https://support.mozilla.org/fr/kb/cookies-informations-sites-enregistrent",
                },
                {
                  browser: "Apple Safari",
                  url: "https://support.apple.com/fr-fr/guide/safari/sfri11471/mac",
                },
                {
                  browser: "Microsoft Edge",
                  url: "https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09",
                },
              ].map(({ browser, url }) => (
                <a
                  key={browser}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-md border-2 border-black bg-white p-3 text-sm font-medium shadow-[2px_2px_0_0_#0a0a0a] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_#0a0a0a]"
                >
                  <span>{browser}</span>
                  <span className="text-indigo-600">→</span>
                </a>
              ))}
            </div>
            <div className="mt-4 rounded-md border-l-4 border-yellow-400 bg-yellow-50 p-4 text-sm text-slate-700">
              <strong>Attention :</strong> Si vous désactivez les cookies de
              session dans votre navigateur, vous ne pourrez plus vous connecter
              à votre compte JuryNote. Les membres du jury accédant via code PIN
              ne seront pas affectés de la même manière, mais leur session sera
              interrompue.
            </div>
          </Section>

          {/* Section 6 - Contact */}
          <Section number="06" title="Contact et questions">
            <p className="text-sm leading-relaxed text-slate-600">
              Pour toute question relative à la présente politique de cookies ou
              à l&apos;utilisation de vos données, contactez-nous :
            </p>
            <dl className="mt-4 divide-y divide-slate-100 text-sm">
              <div className="flex flex-col gap-0.5 py-2 sm:flex-row sm:gap-4">
                <dt className="min-w-[100px] font-bold text-slate-700">
                  E-mail
                </dt>
                <dd>
                  <a
                    href="mailto:erneregis@gmail.com"
                    className="text-indigo-600 hover:underline"
                  >
                    erneregis@gmail.com
                  </a>
                </dd>
              </div>
            </dl>
            <p className="mt-4 text-sm text-slate-500">
              Vous pouvez également exercer vos droits auprès de l&apos;
              <strong>APDP</strong> (Autorité de Protection des Données
              Personnelles du Bénin) — voir notre{" "}
              <Link
                href="/politique-de-confidentialite#section-07"
                className="text-indigo-600 hover:underline"
              >
                politique de confidentialité
              </Link>
              .
            </p>
          </Section>

          {/* Related docs */}
          <div className="rounded-lg border-2 border-indigo-600 bg-indigo-50 p-6">
            <h3 className="font-black text-[#0a0a0a]">Documents connexes</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href="/politique-de-confidentialite"
                className="inline-flex items-center rounded-md border-2 border-black bg-black px-4 py-2 text-sm font-bold text-white shadow-[3px_3px_0_0_#4f46e5] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_#4f46e5]"
              >
                Politique de confidentialité
              </Link>
              <Link
                href="/mentions-legales"
                className="inline-flex items-center rounded-md border-2 border-black bg-white px-4 py-2 text-sm font-bold text-black shadow-[3px_3px_0_0_#0a0a0a] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_#0a0a0a]"
              >
                Mentions légales
              </Link>
              <Link
                href="/cgu"
                className="inline-flex items-center rounded-md border-2 border-black bg-white px-4 py-2 text-sm font-bold text-black shadow-[3px_3px_0_0_#0a0a0a] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_#0a0a0a]"
              >
                CGU
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
