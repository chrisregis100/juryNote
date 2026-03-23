import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mentions légales | JuryFlow",
  description:
    "Informations légales relatives à l&apos;éditeur, l&apos;hébergement et la propriété intellectuelle de la plateforme JuryFlow.",
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
  <div>
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

const DataRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex flex-col gap-0.5 py-2 sm:flex-row sm:gap-4">
    <dt className="min-w-[180px] text-sm font-bold text-slate-700">{label}</dt>
    <dd className="text-sm text-slate-600">{value}</dd>
  </div>
);

export default function MentionsLegalesPage() {
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
              <li className="text-slate-300">Mentions légales</li>
            </ol>
          </nav>
          <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">
            Mentions légales
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
          {/* Intro notice */}
          <div className="rounded-lg border-2 border-yellow-400 bg-yellow-50 p-5">
            <p className="text-sm leading-relaxed text-slate-700">
              Conformément aux dispositions applicables en République du Bénin
              et aux standards de transparence en ligne, les présentes mentions
              légales ont pour objet d&apos;informer les utilisateurs de la
              plateforme <strong>JuryFlow</strong> sur l&apos;identité de
              l&apos;éditeur, les conditions d&apos;hébergement et les règles
              applicables à l&apos;utilisation du site.
            </p>
          </div>

          {/* Section 1 - Éditeur */}
          <Section number="01" title="Éditeur du site">
            <dl className="divide-y divide-slate-100">
              <DataRow
                label="Dénomination commerciale"
                value={<strong>JuryFlow</strong>}
              />
              <DataRow
                label="Société éditrice"
                value="[NOM DE LA SOCIÉTÉ / ÉDITEUR]"
              />
              {/* <DataRow
                label="Forme juridique"
                value="[FORME JURIDIQUE — ex. SARL, SA, SAS…]"
              />
              <DataRow
                label="Capital social"
                value="[MONTANT DU CAPITAL SOCIAL] FCFA"
              />
              <DataRow
                label="N° d'immatriculation (RCCM)"
                value="[NUMÉRO RCCM — Registre du Commerce et du Crédit Mobilier]"
              /> */}
              {/* <DataRow
                label="Siège social"
                value="[ADRESSE DU SIÈGE SOCIAL], Cotonou, Bénin"
              /> */}
              <DataRow
                label="Adresse e-mail"
                value={
                  <a
                    href="mailto:erneregis@gmail.com"
                    className="text-indigo-600 hover:underline"
                  >
                    erneregis@gmail.com
                  </a>
                }
              />
              <DataRow label="Téléphone" value="+2290152435063" />
            </dl>
          </Section>

          {/* Section 2 - Directeur de la publication */}
          <Section number="02" title="Directeur de la publication">
            <dl className="divide-y divide-slate-100">
              <DataRow
                label="Nom et prénom"
                value="[NOM DU DIRECTEUR DE LA PUBLICATION]"
              />
              <DataRow
                label="Qualité"
                value="[GÉRANT / DIRECTEUR GÉNÉRAL / REPRÉSENTANT LÉGAL]"
              />
              <DataRow
                label="Contact"
                value={
                  <a
                    href="mailto:erneregis@gmail.com"
                    className="text-indigo-600 hover:underline"
                  >
                    erneregis@gmail.com
                  </a>
                }
              />
            </dl>
          </Section>

          {/* Section 3 - Hébergement */}
          <Section number="03" title="Hébergement">
            <dl className="divide-y divide-slate-100">
              <DataRow label="Hébergeur" value="[NOM DE L'HÉBERGEUR]" />
              <DataRow label="Adresse" value="[ADRESSE DE L'HÉBERGEUR]" />
              <DataRow label="Site web" value="[SITE WEB DE L'HÉBERGEUR]" />
            </dl>
            <p className="mt-4 text-sm leading-relaxed text-slate-500">
              Les données de la plateforme sont stockées sur des serveurs
              sécurisés. Pour toute question relative à l&apos;hébergement, vous
              pouvez contacter l&apos;hébergeur directement via les coordonnées
              ci-dessus.
            </p>
          </Section>

          {/* Section 4 - Propriété intellectuelle */}
          <Section number="04" title="Propriété intellectuelle">
            <p className="text-sm leading-relaxed text-slate-600">
              L&apos;ensemble des éléments constituant la plateforme JuryFlow —
              notamment les textes, graphismes, logotypes, icônes, images,
              vidéos, animations, logiciels et architecture du site — sont la
              propriété exclusive de l&apos;éditeur ou de ses partenaires et
              sont protégés par les lois applicables en matière de propriété
              intellectuelle.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Toute reproduction, représentation, modification, publication,
              adaptation ou exploitation de tout ou partie des éléments du site,
              par quelque procédé que ce soit, sans l&apos;autorisation
              préalable écrite de l&apos;éditeur, est strictement interdite.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Toute utilisation non autorisée de la plateforme ou de l&apos;un
              des éléments qu&apos;elle contient constitue une contrefaçon et
              pourra donner lieu à des poursuites judiciaires.
            </p>
          </Section>

          {/* Section 5 - Liens hypertextes */}
          <Section number="05" title="Liens hypertextes">
            <p className="text-sm leading-relaxed text-slate-600">
              La plateforme JuryFlow peut contenir des liens hypertextes vers
              d&apos;autres sites internet. Ces liens sont proposés à titre
              informatif. L&apos;éditeur n&apos;a aucun contrôle sur le contenu
              de ces sites et décline toute responsabilité quant aux
              informations qui y figurent.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              La création de liens vers la plateforme JuryFlow est soumise à
              l&apos;accord préalable et exprès de l&apos;éditeur. Pour toute
              demande, contactez-nous à l&apos;adresse indiquée ci-dessus.
            </p>
          </Section>

          {/* Section 6 - Données personnelles */}
          <Section number="06" title="Données personnelles & Cookies">
            <p className="text-sm leading-relaxed text-slate-600">
              La collecte et le traitement des données personnelles effectués
              dans le cadre de l&apos;utilisation de JuryFlow sont régis par la{" "}
              <strong>
                Loi N°2009-09 du 22 mai 2009 portant protection des données à
                caractère personnel en République du Bénin
              </strong>{" "}
              et placés sous le contrôle de l&apos;
              <strong>
                Autorité de Protection des Données Personnelles (APDP)
              </strong>
              , instituée par le{" "}
              <strong>Décret N°2011-029 du 16 février 2011</strong>.
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Link
                href="/politique-de-confidentialite"
                className="inline-flex items-center justify-center rounded-md border-2 border-black bg-black px-4 py-2 text-sm font-bold text-white shadow-[3px_3px_0_0_#4f46e5] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_#4f46e5]"
              >
                Politique de confidentialité →
              </Link>
              <Link
                href="/cookies"
                className="inline-flex items-center justify-center rounded-md border-2 border-black bg-white px-4 py-2 text-sm font-bold text-black shadow-[3px_3px_0_0_#0a0a0a] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_#0a0a0a]"
              >
                Politique de cookies →
              </Link>
            </div>
          </Section>

          {/* Section 7 - Droit applicable */}
          <Section
            number="07"
            title="Droit applicable et juridiction compétente"
          >
            <p className="text-sm leading-relaxed text-slate-600">
              Les présentes mentions légales sont régies par le droit béninois.
              Tout litige relatif à l&apos;interprétation ou à l&apos;exécution
              des présentes sera soumis à la compétence exclusive des tribunaux
              de Cotonou, Bénin, sauf disposition légale contraire.
            </p>
          </Section>

          {/* Contact box */}
          <div className="rounded-lg border-2 border-indigo-600 bg-indigo-50 p-6">
            <h3 className="font-black text-[#0a0a0a]">Une question ?</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Pour toute question relative aux présentes mentions légales, vous
              pouvez nous contacter par e-mail à{" "}
              <a
                href="mailto:erneregis@gmail.com"
                className="font-medium text-indigo-600 hover:underline"
              >
                erneregis@gmail.com
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
