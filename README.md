# JuryFlow

Plateforme de notation et délibération pour hackathons, concours et soutenances.

## Stack

- Next.js 15 (App Router), TypeScript, Tailwind CSS, Radix UI
- PostgreSQL, Prisma
- Next-Auth (organisateur + jury par code PIN)
- Zod, Framer Motion

## Setup

1. **Dépendances**

   ```bash
   npm install
   ```

2. **Base de données**

   Créer une base PostgreSQL et définir `.env` :

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/juryflow?schema=public"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="générer-avec-openssl-rand-base64-32"
   ```

   Puis :

   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   npm run db:seed
   ```

3. **Lancer l’app**

   ```bash
   npm run dev
   ```

- **Accueil** : http://localhost:3000  
- **Connexion organisateur** : http://localhost:3000/login (email : `admin@juryflow.local` après seed)  
- **Accès jury** : http://localhost:3000/jury/join (slug événement + code PIN à 6 chiffres)

## Tests

```bash
npm run test
```

## Scripts

- `npm run dev` – serveur de dev (Turbopack)
- `npm run build` / `npm run start` – build et production
- `npm run db:generate` – générer le client Prisma
- `npm run db:push` – pousser le schéma sans migration
- `npm run db:migrate` – appliquer les migrations
- `npm run db:seed` – seed (utilisateur organisateur)
- `npm run test` – tests unitaires (scoring, validations Zod)
