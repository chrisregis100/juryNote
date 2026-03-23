import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politique de confidentialité | JuryFlow",
  description:
    "Découvrez comment JuryFlow collecte, utilise et protège vos données personnelles conformément à la Loi N°2009-09 du Bénin et à l&apos;Acte Additionnel CEDEAO A/SA.1/01/10.",
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

const InfoBox = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-4 rounded-md border-l-4 border-indigo-600 bg-indigo-50 p-4 text-sm leading-relaxed text-slate-700">
    {children}
  </div>
);

export default function PolitiqueConfidentialitePage() {
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
              <li className="text-slate-300">Politique de confidentialité</li>
            </ol>
          </nav>
          <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">
            Politique de confidentialité
          </h1>
          <p className="mt-3 text-slate-400">
            Dernière mise à jour :{" "}
            <time dateTime="2026-03-22">{LAST_UPDATED}</time>
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              "Loi N°2009-09 — Bénin",
              "APDP",
              "Acte Additionnel CEDEAO A/SA.1/01/10",
              "Convention de Malabo",
            ].map((badge) => (
              <span
                key={badge}
                className="rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-3xl space-y-12">
          {/* Intro */}
          <div className="rounded-lg border-2 border-yellow-400 bg-yellow-50 p-5">
            <p className="text-sm leading-relaxed text-slate-700">
              La protection de vos données personnelles est une priorité pour
              JuryFlow. La présente politique décrit la nature des données
              collectées, les finalités de leur traitement, vos droits et les
              mesures prises pour assurer leur sécurité. Elle est établie
              conformément à la{" "}
              <strong>
                Loi N°2009-09 du 22 mai 2009 portant protection des données à
                caractère personnel en République du Bénin
              </strong>
              , au <strong>Décret N°2011-029 du 16 février 2011</strong> portant
              création de l&apos;APDP, à l&apos;
              <strong>
                Acte Additionnel CEDEAO A/SA.1/01/10 sur la Protection des
                Données Personnelles
              </strong>{" "}
              et à la{" "}
              <strong>
                Convention de l&apos;Union Africaine sur la Cybersécurité et la
                Protection des Données Personnelles (Convention de Malabo)
              </strong>
              .
            </p>
          </div>

          {/* Section 1 - Responsable du traitement */}
          <Section number="01" title="Responsable du traitement">
            <dl className="divide-y divide-slate-100">
              <div className="flex flex-col gap-0.5 py-2 sm:flex-row sm:gap-4">
                <dt className="min-w-[200px] text-sm font-bold text-slate-700">
                  Responsable du traitement
                </dt>
                <dd className="text-sm text-slate-600">
                  JuryFlow — exploité par [NOM DE LA SOCIÉTÉ / ÉDITEUR]
                </dd>
              </div>
              <div className="flex flex-col gap-0.5 py-2 sm:flex-row sm:gap-4">
                <dt className="min-w-[200px] text-sm font-bold text-slate-700">
                  Adresse
                </dt>
                <dd className="text-sm text-slate-600">
                  [ADRESSE DU SIÈGE SOCIAL], Cotonou, Bénin
                </dd>
              </div>
              <div className="flex flex-col gap-0.5 py-2 sm:flex-row sm:gap-4">
                <dt className="min-w-[200px] text-sm font-bold text-slate-700">
                  Contact
                </dt>
                <dd className="text-sm text-slate-600">
                  <a
                    href="mailto:erneregis@gmail.com"
                    className="text-indigo-600 hover:underline"
                  >
                    erneregis@gmail.com
                  </a>
                </dd>
              </div>
              <div className="flex flex-col gap-0.5 py-2 sm:flex-row sm:gap-4">
                <dt className="min-w-[200px] text-sm font-bold text-slate-700">
                  Délégué à la protection des données (DPD)
                </dt>
                <dd className="text-sm text-slate-600">
                  [NOM DU DPD / À DÉSIGNER] — joignable à l&apos;adresse e-mail
                  ci-dessus
                </dd>
              </div>
            </dl>
          </Section>

          {/* Section 2 - Données collectées */}
          <Section number="02" title="Données collectées">
            <p className="mb-4 text-sm leading-relaxed text-slate-600">
              JuryFlow collecte uniquement les données strictement nécessaires à
              la fourniture de ses services. Selon votre rôle sur la plateforme,
              les données suivantes peuvent être collectées :
            </p>
            <div className="space-y-4">
              {[
                {
                  role: "Organisateurs",
                  icon: "🏢",
                  data: [
                    "Adresse e-mail (pour la connexion par lien magique)",
                    "Nom et prénom",
                    "Données relatives aux événements créés (titre, description, critères de notation, participants)",
                  ],
                },
                {
                  role: "Membres du jury",
                  icon: "⚖️",
                  data: [
                    "Prénom ou pseudonyme (saisi par l&apos;organisateur)",
                    "Code PIN d&apos;accès à 6 chiffres (généré automatiquement, hashé en base de données)",
                    "Notes et commentaires attribuées aux participants",
                  ],
                },
                {
                  role: "Participants",
                  icon: "🎯",
                  data: [
                    "Nom et prénom",
                    "Nom de l&apos;équipe / du projet",
                    "Informations de contact optionnelles saisies par l&apos;organisateur",
                    "Statut d&apos;enregistrement (check-in)",
                  ],
                },
                {
                  role: "Tous les utilisateurs",
                  icon: "🌐",
                  data: [
                    "Adresse IP (pour la sécurité et la lutte contre la fraude)",
                    "Données de connexion et journaux d&apos;activité",
                    "Cookies de session (voir Politique de cookies)",
                  ],
                },
              ].map(({ role, icon, data }) => (
                <div key={role} className="rounded-md bg-slate-50 p-4">
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800">
                    <span>{icon}</span>
                    {role}
                  </h3>
                  <ul className="space-y-1 text-sm text-slate-600">
                    {data.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>

          {/* Section 3 - Finalités et bases légales */}
          <Section number="03" title="Finalités et bases légales du traitement">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-black">
                    <th className="pb-2 pr-4 text-left font-bold text-slate-800">
                      Finalité
                    </th>
                    <th className="pb-2 pr-4 text-left font-bold text-slate-800">
                      Base légale
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    {
                      finalite:
                        "Gestion des comptes organisateurs et authentification",
                      base: "Exécution du contrat (art. 5, Loi N°2009-09)",
                    },
                    {
                      finalite: "Organisation et gestion des événements",
                      base: "Exécution du contrat",
                    },
                    {
                      finalite: "Notation et délibération du jury",
                      base: "Intérêt légitime de l&apos;organisateur",
                    },
                    {
                      finalite: "Envoi de liens magiques de connexion (e-mail)",
                      base: "Exécution du contrat",
                    },
                    {
                      finalite:
                        "Sécurité de la plateforme et prévention des fraudes",
                      base: "Intérêt légitime",
                    },
                    {
                      finalite: "Export et partage des résultats",
                      base: "Consentement de l&apos;organisateur",
                    },
                    {
                      finalite: "Amélioration du service",
                      base: "Intérêt légitime",
                    },
                  ].map(({ finalite, base }) => (
                    <tr key={finalite}>
                      <td className="py-2 pr-4 text-slate-600">{finalite}</td>
                      <td className="py-2 text-slate-500 italic">{base}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* Section 4 - Durée de conservation */}
          <Section number="04" title="Durée de conservation">
            <p className="mb-4 text-sm leading-relaxed text-slate-600">
              Les données sont conservées pour une durée n&apos;excédant pas
              celle nécessaire aux finalités pour lesquelles elles ont été
              collectées, conformément à l&apos;article 28 de la Loi N°2009-09 :
            </p>
            <ul className="space-y-3 text-sm">
              {[
                {
                  category: "Comptes organisateurs",
                  duration:
                    "Jusqu&apos;à la suppression du compte, puis 3 ans (obligations légales)",
                },
                {
                  category: "Sessions de connexion",
                  duration:
                    "30 jours (renouvellement automatique à chaque connexion active)",
                },
                {
                  category: "Données d&apos;événements et de notation",
                  duration: "Durée de vie du compte organisateur + 1 an",
                },
                {
                  category: "Données des participants",
                  duration:
                    "Durée de l&apos;événement + 1 an, sauf demande de suppression anticipée",
                },
                {
                  category: "Journaux de connexion et logs de sécurité",
                  duration: "12 mois maximum",
                },
              ].map(({ category, duration }) => (
                <li
                  key={category}
                  className="flex gap-3 rounded-md bg-slate-50 p-3"
                >
                  <span className="mt-0.5 h-2 w-2 shrink-0 rotate-45 bg-indigo-600" />
                  <span>
                    <span className="font-semibold text-slate-800">
                      {category} :
                    </span>{" "}
                    <span className="text-slate-600">{duration}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Section>

          {/* Section 5 - Destinataires */}
          <Section number="05" title="Destinataires des données">
            <p className="mb-4 text-sm leading-relaxed text-slate-600">
              Vos données sont accessibles uniquement aux personnes et entités
              ayant un besoin légitime :
            </p>
            <ul className="space-y-2 text-sm text-slate-600">
              {[
                "Le personnel habilité de l&apos;équipe JuryFlow (accès restreint)",
                "Les organisateurs de l&apos;événement auquel vous participez",
                "Nos sous-traitants techniques (hébergeur, prestataire de base de données, service d&apos;envoi d&apos;e-mails transactionnels Brevo/Sendinblue), liés par des clauses de confidentialité strictes",
                "Les autorités judiciaires ou administratives compétentes, uniquement sur réquisition légale",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />
                  {item}
                </li>
              ))}
            </ul>
            <InfoBox>
              <strong>Aucune vente de données :</strong> JuryFlow ne vend, ne
              loue et ne cède jamais vos données personnelles à des tiers à des
              fins commerciales.
            </InfoBox>
          </Section>

          {/* Section 6 - Vos droits */}
          <Section number="06" title="Vos droits">
            <p className="mb-4 text-sm leading-relaxed text-slate-600">
              Conformément aux articles 30 à 40 de la{" "}
              <strong>Loi N°2009-09 du 22 mai 2009</strong> et à l&apos;
              <strong>Acte Additionnel CEDEAO A/SA.1/01/10</strong>, vous
              disposez des droits suivants sur vos données personnelles :
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  droit: "Droit d&apos;accès",
                  desc: "Obtenir confirmation que vos données sont traitées et en obtenir une copie.",
                },
                {
                  droit: "Droit de rectification",
                  desc: "Demander la correction de données inexactes ou incomplètes.",
                },
                {
                  droit: "Droit à l&apos;effacement",
                  desc: "Obtenir la suppression de vos données dans les cas prévus par la loi.",
                },
                {
                  droit: "Droit d&apos;opposition",
                  desc: "Vous opposer au traitement de vos données pour des motifs légitimes.",
                },
                {
                  droit: "Droit à la portabilité",
                  desc: "Recevoir vos données dans un format structuré et lisible par machine.",
                },
                {
                  droit: "Droit à la limitation",
                  desc: "Demander la suspension temporaire du traitement de vos données.",
                },
              ].map(({ droit, desc }) => (
                <div
                  key={droit}
                  className="rounded-md border border-slate-200 bg-slate-50 p-3"
                >
                  <p className="font-bold text-indigo-700">{droit}</p>
                  <p className="mt-1 text-xs text-slate-600">{desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-md border-2 border-black bg-yellow-50 p-4 text-sm text-slate-700">
              <strong>Comment exercer vos droits :</strong> Envoyez votre
              demande à{" "}
              <a
                href="mailto:erneregis@gmail.com"
                className="font-medium text-indigo-600 hover:underline"
              >
                erneregis@gmail.com
              </a>{" "}
              en précisant votre identité. Nous répondrons dans un délai de{" "}
              <strong>30 jours</strong> ouvrables.
            </div>
          </Section>

          {/* Section 7 - APDP */}
          <Section number="07" title="Autorité de contrôle — APDP">
            <p className="text-sm leading-relaxed text-slate-600">
              Si vous estimez que le traitement de vos données personnelles
              n&apos;est pas conforme à la réglementation en vigueur, vous avez
              le droit de saisir l&apos;
              <strong>
                Autorité de Protection des Données Personnelles (APDP)
              </strong>{" "}
              du Bénin, instituée par le{" "}
              <strong>Décret N°2011-029 du 16 février 2011</strong>.
            </p>
            <dl className="mt-4 divide-y divide-slate-100 text-sm">
              <div className="flex flex-col gap-0.5 py-2 sm:flex-row sm:gap-4">
                <dt className="min-w-[160px] font-bold text-slate-700">
                  Organisme
                </dt>
                <dd className="text-slate-600">
                  APDP — Autorité de Protection des Données Personnelles du
                  Bénin
                </dd>
              </div>
              <div className="flex flex-col gap-0.5 py-2 sm:flex-row sm:gap-4">
                <dt className="min-w-[160px] font-bold text-slate-700">
                  Siège
                </dt>
                <dd className="text-slate-600">Cotonou, République du Bénin</dd>
              </div>
              <div className="flex flex-col gap-0.5 py-2 sm:flex-row sm:gap-4">
                <dt className="min-w-[160px] font-bold text-slate-700">
                  Site web
                </dt>
                <dd className="text-slate-600">
                  <a
                    href="https://apdp.bj"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline"
                  >
                    apdp.bj
                  </a>
                </dd>
              </div>
            </dl>
          </Section>

          {/* Section 8 - Transferts */}
          <Section number="08" title="Transferts internationaux de données">
            <p className="text-sm leading-relaxed text-slate-600">
              Certaines données peuvent être transférées vers des serveurs
              situés hors du Bénin (notamment pour l&apos;hébergement de
              l&apos;application et le service d&apos;envoi d&apos;e-mails). Ces
              transferts sont effectués conformément à l&apos;article 55 de la{" "}
              <strong>Loi N°2009-09</strong> et sous réserve de garanties
              appropriées (clauses contractuelles types, niveau de protection
              adéquat reconnu par l&apos;APDP).
            </p>
            <InfoBox>
              JuryFlow s&apos;engage à ne transférer vos données qu&apos;à des
              prestataires offrant un niveau de protection équivalent à celui
              garanti par le droit béninois et les instruments régionaux
              applicables.
            </InfoBox>
          </Section>

          {/* Section 9 - Sécurité */}
          <Section number="09" title="Sécurité des données">
            <p className="mb-3 text-sm leading-relaxed text-slate-600">
              JuryFlow met en œuvre des mesures techniques et organisationnelles
              appropriées pour protéger vos données contre toute perte,
              altération, accès non autorisé ou divulgation :
            </p>
            <ul className="space-y-2 text-sm text-slate-600">
              {[
                "Chiffrement des communications via HTTPS/TLS",
                "Hashage des codes PIN des membres du jury",
                "Sessions d&apos;authentification sécurisées avec expiration automatique (30 jours)",
                "Accès aux données restreint selon les rôles (organisateur, jury, superviseur)",
                "Journalisation des accès et activités sensibles",
                "Base de données hébergée sur infrastructure sécurisée",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          {/* Section 10 - Modifications */}
          <Section number="10" title="Modifications de la présente politique">
            <p className="text-sm leading-relaxed text-slate-600">
              JuryFlow se réserve le droit de modifier la présente politique de
              confidentialité à tout moment pour refléter les évolutions
              législatives, réglementaires ou les changements apportés à la
              plateforme. La date de dernière mise à jour est indiquée en haut
              de cette page. En cas de modification substantielle, les
              organisateurs enregistrés seront notifiés par e-mail.
            </p>
          </Section>

          {/* Contact bottom */}
          <div className="rounded-lg border-2 border-indigo-600 bg-indigo-50 p-6">
            <h3 className="font-black text-[#0a0a0a]">
              Questions sur vos données ?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Contactez notre équipe à{" "}
              <a
                href="mailto:erneregis@gmail.com"
                className="font-medium text-indigo-600 hover:underline"
              >
                erneregis@gmail.com
              </a>
              . Vous pouvez également consulter nos{" "}
              <Link
                href="/cgu"
                className="font-medium text-indigo-600 hover:underline"
              >
                Conditions Générales d&apos;Utilisation
              </Link>{" "}
              et notre{" "}
              <Link
                href="/cookies"
                className="font-medium text-indigo-600 hover:underline"
              >
                Politique de cookies
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
