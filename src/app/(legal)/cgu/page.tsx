import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Conditions Générales d&apos;Utilisation | JuryFlow",
  description:
    "Conditions générales d&apos;utilisation de la plateforme JuryFlow — droits, obligations, propriété intellectuelle et droit applicable (Bénin).",
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

const WarningBox = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-4 rounded-md border-2 border-rose-400 bg-rose-50 p-4 text-sm leading-relaxed text-slate-700">
    {children}
  </div>
);

export default function CguPage() {
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
              <li className="text-slate-300">
                Conditions Générales d&apos;Utilisation
              </li>
            </ol>
          </nav>
          <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">
            Conditions Générales d&apos;Utilisation
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
              Les présentes Conditions Générales d&apos;Utilisation (ci-après «
              CGU ») régissent l&apos;accès et l&apos;utilisation de la
              plateforme <strong>JuryFlow</strong> (accessible à [URL DE LA
              PLATEFORME]). En accédant à la plateforme, vous acceptez sans
              réserve les présentes CGU. Si vous n&apos;acceptez pas ces
              conditions, vous devez cesser immédiatement d&apos;utiliser la
              plateforme.
            </p>
          </div>

          {/* Section 1 - Objet */}
          <Section number="01" title="Objet">
            <p className="text-sm leading-relaxed text-slate-600">
              Les présentes CGU ont pour objet de définir les conditions dans
              lesquelles <strong>JuryFlow</strong> (ci-après « la Plateforme »)
              met à disposition des organisateurs, membres du jury, superviseurs
              et participants (ci-après collectivement « les Utilisateurs ») une
              solution logicielle de gestion, notation et délibération pour
              hackathons, concours et événements compétitifs.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Les présentes CGU constituent un contrat entre l&apos;éditeur de
              la Plateforme et tout Utilisateur. Elles sont applicables à toutes
              les fonctionnalités de la Plateforme, notamment :
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
              {[
                "La création et la gestion d&apos;événements",
                "L&apos;inscription et la gestion des participants",
                "L&apos;attribution de critères de notation et leur pondération",
                "La notation en temps réel par les membres du jury",
                "La délibération collaborative",
                "L&apos;export des résultats",
                "La supervision en direct",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          {/* Section 2 - Accès */}
          <Section number="02" title="Accès à la plateforme">
            <p className="mb-3 text-sm leading-relaxed text-slate-600">
              L&apos;accès à JuryFlow est différencié selon les rôles :
            </p>
            <div className="space-y-3">
              {[
                {
                  role: "Organisateurs",
                  condition:
                    "Inscription via adresse e-mail et connexion par lien magique (magic link). L&apos;accès est soumis à une validation préalable par l&apos;équipe JuryFlow.",
                  color: "border-indigo-200 bg-indigo-50",
                },
                {
                  role: "Membres du jury",
                  condition:
                    "Accès via un code PIN à 6 chiffres fourni par l&apos;organisateur. Aucun compte personnel n&apos;est requis.",
                  color: "border-yellow-200 bg-yellow-50",
                },
                {
                  role: "Superviseurs",
                  condition:
                    "Accès via invitation de l&apos;organisateur, avec authentification sécurisée.",
                  color: "border-green-200 bg-green-50",
                },
                {
                  role: "Participants",
                  condition:
                    "Accès au formulaire de check-in via un lien public fourni par l&apos;organisateur. Aucun compte requis.",
                  color: "border-slate-200 bg-slate-50",
                },
              ].map(({ role, condition, color }) => (
                <div key={role} className={`rounded-md border ${color} p-3`}>
                  <p className="text-sm font-bold text-slate-800">{role}</p>
                  <p className="mt-1 text-sm text-slate-600">{condition}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              La Plateforme est accessible 24h/24 et 7j/7, sous réserve des
              opérations de maintenance et des interruptions de service
              indépendantes de la volonté de JuryFlow.
            </p>
          </Section>

          {/* Section 3 - Inscription */}
          <Section number="03" title="Inscription et comptes utilisateurs">
            <p className="mb-3 text-sm leading-relaxed text-slate-600">
              L&apos;Utilisateur qui s&apos;inscrit en qualité
              d&apos;organisateur s&apos;engage à :
            </p>
            <ul className="space-y-2 text-sm text-slate-600">
              {[
                "Fournir des informations exactes, complètes et à jour lors de l&apos;inscription",
                "Maintenir la confidentialité de ses accès (lien magique, session)",
                "Notifier immédiatement JuryFlow de tout accès non autorisé à son compte",
                "Ne pas créer plusieurs comptes pour contourner des restrictions",
                "Ne pas céder son accès à des tiers non autorisés",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              L&apos;Utilisateur est seul responsable de l&apos;ensemble des
              activités effectuées depuis son compte.
            </p>
          </Section>

          {/* Section 4 - Conditions d&apos;utilisation */}
          <Section number="04" title="Utilisation acceptable de la plateforme">
            <p className="mb-3 text-sm leading-relaxed text-slate-600">
              L&apos;Utilisateur s&apos;engage à utiliser la Plateforme dans le
              respect de la réglementation applicable et des droits des tiers.
              Il est notamment interdit de :
            </p>
            <ul className="space-y-2 text-sm text-slate-600">
              {[
                "Utiliser la Plateforme à des fins illégales, frauduleuses ou nuisibles",
                "Tenter de contourner les mécanismes de sécurité ou d&apos;authentification",
                "Accéder à des données auxquelles vous n&apos;êtes pas autorisé à accéder",
                "Télécharger, transmettre ou diffuser des contenus illicites, diffamatoires ou portant atteinte aux droits de tiers",
                "Reproduire, copier, revendre ou exploiter commercialement tout ou partie de la Plateforme sans autorisation préalable",
                "Utiliser des robots, scrapers ou outils automatisés pour collecter des données",
                "Perturber le fonctionnement normal de la Plateforme (attaques DDoS, injection de code…)",
                "Usurper l&apos;identité d&apos;un autre Utilisateur",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                  {item}
                </li>
              ))}
            </ul>
            <WarningBox>
              Tout manquement aux présentes conditions peut entraîner la
              suspension ou la résiliation immédiate du compte, sans préavis ni
              remboursement, et sans préjudice de tout recours judiciaire.
            </WarningBox>
          </Section>

          {/* Section 5 - Responsabilités utilisateur */}
          <Section number="05" title="Responsabilités de l'Utilisateur">
            <p className="mb-3 text-sm leading-relaxed text-slate-600">
              L&apos;Utilisateur est seul responsable :
            </p>
            <ul className="space-y-2 text-sm text-slate-600">
              {[
                "Du contenu qu&apos;il crée et importe sur la Plateforme (événements, critères, participants…)",
                "Des notes et appréciations saisies dans le cadre de son rôle de juré",
                "Du partage des codes PIN avec les membres du jury désignés",
                "De l&apos;exactitude des informations relatives aux participants",
                "De l&apos;utilisation qui est faite des résultats exportés",
                "Du respect des droits à la vie privée des participants dont les données sont saisies",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              L&apos;organisateur qui collecte des données personnelles de
              participants via la Plateforme agit en qualité de responsable du
              traitement au sens de la Loi N°2009-09 du 22 mai 2009 et est tenu
              de respecter les obligations légales y afférentes.
            </p>
          </Section>

          {/* Section 6 - Propriété intellectuelle */}
          <Section number="06" title="Propriété intellectuelle">
            <p className="mb-3 text-sm leading-relaxed text-slate-600">
              L&apos;ensemble des éléments de la Plateforme — code source,
              algorithmes, interfaces graphiques, logos, marques, textes et
              contenus éditoriaux — sont la propriété exclusive de
              l&apos;éditeur de JuryFlow et sont protégés par les lois
              béninoises et internationales sur la propriété intellectuelle.
            </p>
            <p className="text-sm leading-relaxed text-slate-600">
              L&apos;Utilisateur conserve l&apos;intégralité des droits sur les
              données qu&apos;il crée (événements, critères, résultats). Il
              accorde à JuryFlow une licence limitée, non exclusive et non
              cessible pour traiter ces données aux seules fins de la fourniture
              du service.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Toute reproduction, représentation ou exploitation non autorisée
              des éléments de la Plateforme est susceptible de constituer une
              contrefaçon et pourra donner lieu à des poursuites civiles et
              pénales.
            </p>
          </Section>

          {/* Section 7 - Responsabilité JuryFlow */}
          <Section number="07" title="Responsabilité de JuryFlow">
            <p className="mb-3 text-sm leading-relaxed text-slate-600">
              JuryFlow s&apos;engage à mettre en œuvre tous les moyens
              raisonnables pour assurer un accès de qualité à la Plateforme.
              Cependant, JuryFlow ne peut être tenu responsable :
            </p>
            <ul className="space-y-2 text-sm text-slate-600">
              {[
                "Des interruptions temporaires du service pour maintenance",
                "Des dommages résultant d&apos;une utilisation frauduleuse ou non conforme de la Plateforme par un tiers",
                "De la perte de données résultant d&apos;une faute ou négligence de l&apos;Utilisateur",
                "Des décisions prises sur la base des résultats générés par la Plateforme",
                "Des contenus publiés par les Utilisateurs",
                "Des dommages indirects, pertes de données ou pertes de revenus liés à l&apos;utilisation ou l&apos;impossibilité d&apos;utiliser la Plateforme",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          {/* Section 8 - Disponibilité */}
          <Section number="08" title="Disponibilité du service et maintenance">
            <p className="text-sm leading-relaxed text-slate-600">
              JuryFlow s&apos;efforce de maintenir la Plateforme disponible en
              permanence mais ne garantit pas une disponibilité de 100 %. Des
              opérations de maintenance peuvent entraîner des interruptions
              temporaires, annoncées dans la mesure du possible avec un préavis
              raisonnable.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              JuryFlow se réserve le droit de modifier, suspendre ou interrompre
              tout ou partie des fonctionnalités de la Plateforme à tout moment,
              notamment pour des raisons techniques, légales ou commerciales.
            </p>
          </Section>

          {/* Section 9 - Modifications des CGU */}
          <Section number="09" title="Modifications des présentes CGU">
            <p className="text-sm leading-relaxed text-slate-600">
              JuryFlow se réserve le droit de modifier les présentes CGU à tout
              moment. Les modifications entrent en vigueur dès leur publication
              sur la Plateforme. La date de dernière mise à jour est indiquée en
              tête du présent document.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              En cas de modifications substantielles affectant les droits des
              Utilisateurs, une notification sera envoyée aux organisateurs
              enregistrés par e-mail. La poursuite de l&apos;utilisation de la
              Plateforme après notification vaudra acceptation des nouvelles
              conditions.
            </p>
          </Section>

          {/* Section 10 - Résiliation */}
          <Section number="10" title="Résiliation">
            <p className="mb-3 text-sm leading-relaxed text-slate-600">
              L&apos;Utilisateur peut à tout moment cesser d&apos;utiliser la
              Plateforme et demander la suppression de son compte en contactant
              JuryFlow.
            </p>
            <p className="text-sm leading-relaxed text-slate-600">
              JuryFlow peut suspendre ou résilier l&apos;accès d&apos;un
              Utilisateur sans préavis ni remboursement en cas de :
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
              {[
                "Violation des présentes CGU",
                "Activité frauduleuse ou illicite",
                "Non-paiement des services (si applicable)",
                "Inactivité prolongée du compte",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          {/* Section 11 - Droit applicable */}
          <Section
            number="11"
            title="Droit applicable et juridiction compétente"
          >
            <p className="text-sm leading-relaxed text-slate-600">
              Les présentes CGU sont régies et interprétées conformément au
              droit de la <strong>République du Bénin</strong>, notamment :
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
              {[
                "La Loi N°2009-09 du 22 mai 2009 portant protection des données à caractère personnel en République du Bénin",
                "L&apos;Acte Additionnel CEDEAO A/SA.1/01/10 sur la Protection des Données Personnelles",
                "La Convention de l&apos;Union Africaine sur la Cybersécurité et la Protection des Données Personnelles (Convention de Malabo)",
                "Le Code du commerce béninois",
                "Tout texte législatif ou réglementaire applicable en République du Bénin",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-4 rounded-md border-2 border-black bg-slate-50 p-4 text-sm text-slate-700">
              <strong>Juridiction :</strong> En cas de litige relatif à
              l&apos;interprétation ou à l&apos;exécution des présentes CGU, et
              à défaut de résolution amiable dans un délai de 30 jours suivant
              la notification du litige, les parties attribuent compétence
              exclusive aux <strong>Tribunaux de Cotonou</strong>, République du
              Bénin.
            </div>
          </Section>

          {/* Section 12 - Contact */}
          <Section number="12" title="Contact">
            <p className="text-sm leading-relaxed text-slate-600">
              Pour toute question relative aux présentes CGU, contactez-nous :
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
              <div className="flex flex-col gap-0.5 py-2 sm:flex-row sm:gap-4">
                <dt className="min-w-[100px] font-bold text-slate-700">
                  Adresse
                </dt>
                <dd className="text-slate-600">
                  [ADRESSE DU SIÈGE SOCIAL], Cotonou, Bénin
                </dd>
              </div>
            </dl>
          </Section>

          {/* Legal links */}
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
                href="/cookies"
                className="inline-flex items-center rounded-md border-2 border-black bg-white px-4 py-2 text-sm font-bold text-black shadow-[3px_3px_0_0_#0a0a0a] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_#0a0a0a]"
              >
                Politique de cookies
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
