# JuryFlow

Plateforme de notation et de délibération pour jurys de hackathons et compétitions.

## Stack technique

| Couche        | Technologie                                          |
| ------------- | ---------------------------------------------------- |
| Framework     | Next.js 16 (App Router, Turbopack)                   |
| Runtime       | React 19                                             |
| Base de données | PostgreSQL + Prisma 6                              |
| Authentification | Better Auth (liens magiques organisateur) + NextAuth (PIN jury) |
| E-mails transactionnels | Brevo (API) avec repli SMTP optionnel |
| UI            | Tailwind CSS 4, Radix UI, Framer Motion              |
| Validation    | Zod                                                  |
| Tests         | Vitest                                               |

## Fonctionnalités

### Landing page publique

- Page d'accueil complète avec sections Hero, Statistiques, Fonctionnalités, Comment ça marche, Témoignages, Tarifs et FAQ.
- Navigation responsive avec menu mobile.
- Animations au scroll (Framer Motion).
- Redirection automatique vers `/jury` ou `/admin` si l'utilisateur est déjà connecté.

### Authentification et rôles

- **Trois rôles** : organisateur, jury, superviseur.
- **Inscription / connexion organisateur** : pages `/register` et `/login` avec **lien magique** envoyé par **e-mail** (Brevo Transactional API si `BREVO_API_KEY` est défini, sinon SMTP).
- **SMS Brevo** : module `src/lib/email/brevo-sms.ts` pour les SMS transactionnels (OTP, rappels) — à brancher selon vos flux ; les liens magiques restent par e-mail.
- **Connexion jury** : accès par slug d'événement + code PIN à 6 chiffres via `/jury/join`.
- Session JWT d'une durée de 30 jours.
- Protection des routes par vérification de session dans les layouts serveur.
- Redirection automatique selon le rôle après connexion.

### Gestion des événements (organisateur)

- **Liste des événements** (`/admin`) : vue d'ensemble avec compteurs d'équipes, de critères et de jurys assignés.
- **Création d'événement** (`/admin/events/new`) : nom et slug personnalisé.
- **Configuration d'un événement** (`/admin/events/[eventId]`) :
  - Ajout et gestion des **équipes** (nom, membres en JSON).
  - Définition des **critères de notation** : nom, coefficient (poids), type d'échelle (0–5, 0–10, 0–20), ordre d'affichage.
  - **Génération de codes PIN** pour inviter les jurys (code 6 chiffres + magic token + date d'expiration).
  - Lien direct vers la vue de délibération.
- **Statuts d'événement** : brouillon, ouvert, délibération, clôturé.

### Notation (jury)

- **Tableau de bord** (`/jury`) : progression et accès rapide à la notation.
- **Liste des équipes** (`/jury/teams`) : toutes les équipes avec statut (Noté / À noter).
- **Formulaire de notation** (`/jury/teams/[teamId]`) :
  - Un slider par critère avec échelle configurée.
  - Champ de commentaire par critère.
  - Sauvegarde automatique avec debounce (~800 ms).
  - Blocage de la notation lorsque la délibération est verrouillée.
- **Récapitulatif** (`/jury/summary`) : synthèse de toutes les notes attribuées par le membre du jury.

### Délibération (organisateur)

- **Vue de délibération** (`/admin/events/[eventId]/deliberation`) ; l’ancienne URL `/supervisor/events/[eventId]` redirige vers cette page :
  - Tableau de classement des équipes en temps réel.
  - Calcul par moyenne pondérée : `Σ(Note × Coefficient) / Σ(Coefficients)`.
  - Bouton de clôture de la délibération.
- **Verrouillage** : une fois la délibération clôturée, les notes ne peuvent plus être modifiées.
- **Snapshot du classement** : sauvegarde figée du classement final à la clôture.

### Temps réel

- Endpoint SSE (`/api/events/[eventId]/stream`) : flux temps réel envoyant le nombre de notes et le statut de délibération toutes les 3 secondes.

### Scoring

- Calcul de score pondéré par équipe : chaque critère est pondéré par son coefficient.
- Classement automatique des équipes par score décroissant.

## Modèle de données

| Modèle            | Description                                                         |
| ----------------- | ------------------------------------------------------------------- |
| User              | Utilisateur (organisateur, jury, superviseur) avec email et rôle    |
| Event             | Événement/compétition avec nom, slug et statut                      |
| Team              | Équipe rattachée à un événement                                     |
| Criterion         | Critère de notation avec poids, échelle et ordre                    |
| JuryAssignment    | Lien jury–événement avec code PIN, magic token et expiration        |
| Grade             | Note attribuée (valeur + commentaire) par jury, par équipe et critère |
| Deliberation      | Session de délibération par événement (ouverte ou verrouillée)      |
| RankingSnapshot   | Classement figé à la clôture d'une délibération                     |

## Structure du projet

```
src/
├── app/
│   ├── (landing)/           # Page d'accueil publique
│   ├── (auth)/              # Pages de connexion
│   │   ├── login/           # Connexion organisateur
│   │   └── jury/join/       # Connexion jury (slug + PIN)
│   ├── (admin)/admin/       # Espace organisateur
│   │   ├── events/new/      # Création d'événement
│   │   └── events/[eventId]/ # Configuration d'événement
│   ├── (jury)/jury/         # Espace jury
│   │   ├── teams/[teamId]/  # Notation d'une équipe
│   │   └── summary/         # Récapitulatif des notes
│   ├── (supervisor)/        # Espace superviseur / délibération
│   └── api/                 # Routes API (auth, SSE)
├── components/              # Composants UI (Shadcn, landing, shared)
├── lib/                     # Utilitaires (auth, DB, scoring, validation)
└── server/actions/          # Server Actions (événements, notes, délibération)
```

## Documentation API (Swagger/OpenAPI)

La spécification OpenAPI 3.0 de l’API est dans **`openapi.yaml`** à la racine du projet. Elle décrit :

- **Authentification** : NextAuth (session, signin credentials, signin jury-pin, signout)
- **Événements** : création d’événement, génération de codes PIN jury
- **Équipes et critères** : création d’équipes et de critères par événement
- **Notes** : upsert des notes (jury)
- **Délibérations** : récupération/création, clôture, classement
- **Temps réel** : flux SSE `/api/events/[eventId]/stream`

Vous pouvez importer `openapi.yaml` dans [Swagger Editor](https://editor.swagger.io/) ou un outil compatible OpenAPI pour explorer et tester l’API.

## Scripts

| Commande            | Description                              |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Serveur de développement (Turbopack)     |
| `npm run build`     | Build de production                      |
| `npm run start`     | Démarrage en production                  |
| `npm run lint`      | Linting ESLint                           |
| `npm run db:generate` | Génération du client Prisma            |
| `npm run db:push`   | Push du schéma vers la base de données   |
| `npm run db:migrate`| Migration Prisma                         |
| `npm run db:studio` | Interface Prisma Studio                  |
| `npm run db:seed`   | Seed de la base de données               |
| `npm run test`      | Exécution des tests (Vitest)             |
| `npm run test:watch`| Tests en mode watch                      |

## Documentation API

La documentation OpenAPI/Swagger de l'API est disponible dans le fichier [`openapi.yaml`](./openapi.yaml) à la racine du projet.

Cette spécification OpenAPI 3.0 documente :
- Les routes d'authentification NextAuth (`/api/auth/[...nextauth]`)
- Le flux SSE temps réel (`/api/events/[eventId]/stream`)
- Les actions serveur exposées comme endpoints REST :
  - Gestion des événements, équipes, critères
  - Génération de codes PIN pour les jurys
  - Notation (grades)
  - Délibération et classement

Vous pouvez visualiser cette documentation avec des outils comme [Swagger UI](https://swagger.io/tools/swagger-ui/) ou [Redoc](https://redocly.com/).

## Démarrage rapide

```bash
# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Renseigner DATABASE_URL et NEXTAUTH_SECRET dans .env

# Initialiser la base de données
npm run db:push
npm run db:seed

# Lancer le serveur de développement
npm run dev
```

Le seed crée un compte organisateur `admin@juryflow.local` pour commencer.
