# Plan d'amélioration de l'accessibilité – JuryNote

**Référence :** WCAG 2.1 niveau AA  
**Stack :** Next.js, React 19, Shadcn UI, Radix UI  
**Date :** Mars 2025

---

## 1. Synthèse et ordre d’implémentation

| Priorité | Thème | Effort estimé | Impact |
|----------|--------|----------------|--------|
| **Critique** | Skip link + cible main | Faible | 2.4.1 (Bypass Blocks) |
| **Critique** | Sliders : aria-label / aria-valuetext | Faible | 1.3.1, 4.1.2 |
| **Critique** | Labels / champs : association explicite (notation, PIN) | Moyen | 1.3.1, 3.3.2 |
| **Important** | Landmarks : nav, main, id pour skip | Faible | 1.3.1, 2.4.1 |
| **Important** | Live regions (sauvegarde, statuts) | Faible | 4.1.3 |
| **Important** | Navigation clavier : menu mobile (focus trap, Échap) | Moyen | 2.1.1, 2.1.2 |
| **Important** | Boutons icon-only : aria-label systématique | Faible | 1.1.1, 4.1.2 |
| **Amélioration** | Contraste (vérification / ajustement) | Moyen | 1.4.3 |
| **Amélioration** | FAQ : aria-controls + id région | Faible | 4.1.2 |
| **Amélioration** | Hiérarchie des titres (h1 unique, ordre) | Faible | 1.3.1, 2.4.6 |

L’ordre recommandé est celui du tableau : traiter d’abord les points **Critique**, puis **Important**, puis **Amélioration**.

---

## 2. Détail par catégorie

### 2.1 Navigation clavier et skip link (WCAG 2.4.1, 2.1.1, 2.1.2)

#### Problème
- Aucun lien d’évitement (« skip to main content ») : les utilisateurs au clavier et les lecteurs d’écran doivent traverser tout le header à chaque chargement.
- Référence WCAG : **2.4.1 Bypass Blocks (A)**.

#### Fichiers concernés
- `src/app/layout.tsx` : point d’injection global du skip link (recommandé).
- `src/components/landing/navbar.tsx` : si le skip link est placé dans le premier bloc focusable de la landing.
- `src/app/(jury)/jury/layout.tsx`, `src/app/(admin)/admin/layout.tsx` : s’assurer qu’une cible `id="main"` existe pour le skip.
- `src/app/page.tsx` : `<main>` doit avoir `id="main"` pour être la cible du skip sur la landing.

#### Solution proposée
1. **Skip link global (layout racine)**  
   - Ajouter en tout premier dans le `<body>` un lien visible au focus : « Aller au contenu principal » (ou équivalent), avec `href="#main"`.  
   - Styles : position fixe, décalage négatif hors écran, et au `:focus-visible` le ramener à l’écran (ex. `left: 0`, `top: 0`, z-index élevé, padding, fond contrasté).  
   - S’assurer que le lien est le premier élément focusable (ordre du DOM).

2. **Cible main**  
   - Sur la landing : dans `src/app/page.tsx`, donner à `<main>` l’attribut `id="main"`.  
   - Dans les layouts jury et admin : donner à la balise `<main>` l’attribut `id="main"` (déjà présents dans ces layouts).

3. **Navigation clavier menu mobile**  
   - Fichier : `src/components/landing/mobile-nav.tsx`.  
   - À l’ouverture du menu : déplacer le focus vers le premier lien (ou vers le conteneur du menu avec `tabIndex={-1}` puis focus sur le premier lien).  
   - À la fermeture : remettre le focus sur le bouton « Ouvrir le menu ».  
   - Fermeture à la touche **Échap** : écouter `keydown` sur `Escape` et appeler `handleClose()`.  
   - Optionnel mais recommandé : piéger le focus dans le panneau tant que le menu est ouvert (focus trap) pour respecter 2.1.2 (No Keyboard Trap).

---

### 2.2 ARIA et composants contrôlés

#### 2.2.1 Sliders (notation) – CRITIQUE

**Problème**  
- Les sliders du formulaire de notation n’ont pas de nom accessible ni de valeur lue par les technologies d’assistance.  
- Référence : **1.3.1 Info and Relationships (A)**, **4.1.2 Name, Role, Value (A)**.

**Fichiers**
- `src/components/ui/slider.tsx` : composant générique.
- `src/app/(jury)/jury/teams/[teamId]/notation-form.tsx` : usage des sliders avec critères.

**Solution**
1. **Slider UI**  
   - Accepter des props optionnelles : `aria-label`, `aria-valuetext`, et les transmettre au `SliderPrimitive.Root` (et si besoin au Thumb).  
   - Si `aria-valuetext` n’est pas fourni, construire une valeur lisible à partir de `value`, `min`, `max` (ex. « 7 sur 10 »).

2. **Notation form**  
   - Pour chaque critère, passer au `Slider` :  
     - `aria-label={c.name}` (ou libellé incluant l’échelle, ex. « Critère X, de 0 à 10 »).  
     - `aria-valuetext` dérivé de la valeur actuelle et du max (ex. « 7 sur 10 ») pour une annonce claire.

#### 2.2.2 Boutons icon-only

**Problème**  
- Tout bouton qui ne contient qu’une icône doit avoir un nom accessible (aria-label ou texte visible).  
- Référence : **1.1.1 Non-text Content (A)**, **4.1.2 Name, Role, Value (A)**.

**Fichiers**
- `src/components/ui/button.tsx` : lorsque `size="icon"` (ou usage sans texte), s’assurer que l’appelant fournit toujours un `aria-label` (documentation + éventuel warning en dev si enfant vide et pas d’aria-label).
- `src/components/landing/mobile-nav.tsx` : déjà conforme (aria-label + aria-expanded).
- Vérifier tout usage de `<Button size="icon">` ou boutons avec uniquement une icône dans :  
  `src/components/sign-out-button.tsx` (actuellement avec texte « Déconnexion » → OK), et le reste du projet.

**Solution**
- Pour chaque bouton icon-only : ajouter `aria-label` explicite (ex. « Fermer », « Ouvrir le menu »).  
- Dans la doc du design system / Storybook, exiger `aria-label` pour les boutons icon-only.

#### 2.2.3 FAQ (accordéons)

**Problème**  
- Les boutons ont `aria-expanded` mais pas de lien explicite avec la région dépliable (absence d’`aria-controls` et d’`id` sur la région).  
- Référence : **4.1.2 Name, Role, Value (A)**.

**Fichier**  
- `src/components/landing/faq.tsx`.

**Solution**
- Donner un `id` unique à la région dépliable (ex. `id={accordionId}`).
- Sur le bouton : `aria-controls={accordionId}`.
- Conserver `aria-expanded={isOpen}`.

---

### 2.3 Labels et association champs (sémantique HTML)

#### 2.3.1 Formulaire de notation

**Problème**  
- Le libellé du critère est visuellement au-dessus du slider et du textarea, mais :  
  - Le slider Radix n’est pas associé via un `<label for="...">` (le slider n’a pas d’`id` stable).  
  - Le textarea « Commentaire (optionnel) » n’a pas d’`id` ni de `<Label htmlFor="...">`.  
- Référence : **1.3.1 Info and Relationships (A)**, **3.3.2 Labels or Instructions (A)**.

**Fichier**  
- `src/app/(jury)/jury/teams/[teamId]/notation-form.tsx`.

**Solution**
1. **Slider**  
   - Utiliser `aria-label` / `aria-labelledby` sur le slider (voir 2.2.1).  
   - Option : donner un `id` au `Label` du critère (ex. `id={labelId}`) et sur le Slider `aria-labelledby={labelId}`.

2. **Textarea**  
   - Ajouter un `id` par critère pour le commentaire (ex. `comment-${c.id}`).  
   - Utiliser `<Label htmlFor={commentId}>Commentaire (optionnel)</Label>` ou au minimum `aria-label="Commentaire (optionnel)"` sur le textarea, et idéalement les deux (label visible + id/htmlFor pour association explicite).

#### 2.3.2 Formulaire « Code PIN » (jury join)

**Problème**  
- Le libellé « Code PIN (6 chiffres) » n’est pas associé aux 6 champs (pas d’`htmlFor` car ce sont plusieurs inputs).  
- Référence : **1.3.1**, **3.3.2**.

**Fichier**  
- `src/app/(auth)/jury/join/jury-join-form.tsx`.

**Solution**
- Envelopper les 6 champs dans un `<fieldset>` avec un `<legend>Code PIN (6 chiffres)</legend>`.  
- Garder les `aria-label` sur chaque input (« Chiffre 1 du code PIN », etc.) pour renforcer le contexte.

---

### 2.4 Landmarks (structure de la page)

**Problème**  
- La barre de navigation n’a pas de nom (absence d’`aria-label` sur `<nav>`).  
- Le contenu principal n’a pas d’`id="main"` sur la landing pour le skip link.  
- Référence : **1.3.1 Info and Relationships (A)**, **2.4.1 Bypass Blocks (A)**.

**Fichiers**
- `src/components/landing/navbar.tsx` : `<nav>` → ajouter `aria-label="Navigation principale"` (ou « Navigation du site »).
- `src/app/page.tsx` : `<main>` → ajouter `id="main"`.
- `src/app/(jury)/jury/layout.tsx`, `src/app/(admin)/admin/layout.tsx` : s’assurer que `<main>` a bien `id="main"`.

**Solution**
- Sur chaque `<nav>` : `aria-label` descriptif.  
- Sur chaque `<main>` : `id="main"` pour cohérence et skip link.

---

### 2.5 Live regions (contenu dynamique)

**Problème**  
- Le message « Sauvegarde… » dans le formulaire de notation apparaît sans annonce aux technologies d’assistance.  
- Référence : **4.1.3 Status Messages (AA)**.

**Fichier**  
- `src/app/(jury)/jury/teams/[teamId]/notation-form.tsx`.

**Solution**
- Placer le message « Sauvegarde… » (et éventuellement un message de succès discret) dans un conteneur avec `role="status"` et `aria-live="polite"` (ou `aria-live="polite"` seul sur un élément qui contient le statut).  
- Garder `role="alert"` pour les erreurs (déjà en place) pour une annonce immédiate.

**À vérifier ailleurs**  
- Tout message de chargement ou de succès qui apparaît dynamiquement (formulaires admin) : utiliser `role="status"` et/ou `aria-live="polite"` si le message n’est pas déjà dans un `role="alert"`.

---

### 2.6 Contraste (WCAG 1.4.3)

**Référence**  
- **1.4.3 Contrast (Minimum) (AA)** : rapport de contraste au moins 4,5:1 pour le texte normal, 3:1 pour le gros texte.

**Fichiers à vérifier / ajuster**
- `src/app/globals.css` et tous les composants utilisant des couleurs texte/fond (slate-500, slate-600, slate-700 sur fond blanc ou slate-50).
- Composants landing : `src/components/landing/hero.tsx`, `features.tsx`, `footer.tsx`, `pricing.tsx`, `faq.tsx`, etc.
- Formulaires : textes d’erreur `text-red-600` sur `bg-red-50`, textes secondaires sur fond clair.

**Solution**
- Auditer avec un outil (axe DevTools, Contrast Checker, ou Lighthouse) les combinaisons :  
  - Texte principal : foreground sur background.  
  - Texte secondaire : slate-600 / slate-500 sur blanc.  
- Ajuster les classes (ex. préférer slate-700 ou slate-800 pour le texte secondaire si le contraste est insuffisant) jusqu’à atteindre au moins 4,5:1 (3:1 pour gros texte).

---

### 2.7 Sémantique HTML et titres

**Référence**  
- **1.3.1**, **2.4.6 Headings and Labels (AA)** : hiérarchie logique, un seul h1 par page.

**Fichiers**
- Pages principales : `src/app/page.tsx`, `src/app/(auth)/login/page.tsx`, `src/app/(auth)/jury/join/page.tsx`, `src/app/(jury)/jury/page.tsx`, `src/app/(admin)/admin/page.tsx`, et vues jury/admin.
- Composants landing : hero, features, how-it-works, faq, etc.

**Solution**
- Vérifier qu’il n’y a qu’un seul `<h1>` par page et qu’il décrit le contenu de la page.  
- Vérifier l’ordre des titres (h1 → h2 → h3 sans saut).  
- Remplacer les titres purement visuels (div + grande police) par des balises `<h2>`, `<h3>` appropriées.

---

## 3. Liste des fichiers à modifier (par priorité)

### Priorité critique
| Fichier | Modification |
|---------|--------------|
| `src/app/layout.tsx` | Ajout du skip link (lien « Aller au contenu principal » + styles focus). |
| `src/app/page.tsx` | Ajout de `id="main"` sur `<main>`. |
| `src/components/ui/slider.tsx` | Support de `aria-label`, `aria-valuetext` (et transmission au primitif Radix). |
| `src/app/(jury)/jury/teams/[teamId]/notation-form.tsx` | Slider : aria-label / aria-valuetext par critère ; Textarea : id + Label ou aria-label ; message « Sauvegarde… » en live region. |
| `src/app/(auth)/jury/join/jury-join-form.tsx` | Fieldset + legend pour le bloc « Code PIN (6 chiffres) ». |

### Priorité importante
| Fichier | Modification |
|---------|--------------|
| `src/components/landing/navbar.tsx` | `aria-label` sur `<nav>`. |
| `src/app/(jury)/jury/layout.tsx` | `id="main"` sur `<main>` (si pas déjà fait). |
| `src/app/(admin)/admin/layout.tsx` | `id="main"` sur `<main>`. |
| `src/components/landing/mobile-nav.tsx` | Gestion focus (ouverture/fermeture), Échap pour fermer, optionnel : focus trap. |
| `src/components/ui/button.tsx` | Documentation / prop pour exiger `aria-label` lorsque le contenu est uniquement une icône. |

### Priorité amélioration
| Fichier | Modification |
|---------|--------------|
| `src/components/landing/faq.tsx` | `id` sur la région dépliable + `aria-controls` sur le bouton. |
| Composants landing + globals | Vérification contraste (slate-*, textes sur fonds clairs). |
| Pages et sections (hero, features, etc.) | Vérification hiérarchie h1/h2/h3 et usage de balises sémantiques. |

---

## 4. Checklist WCAG 2.1 AA (extrait pertinent)

- **1.1.1** Non-text Content : tous les contrôles et icônes ont un nom (aria-label ou texte).
- **1.3.1** Info and Relationships : labels associés, landmarks, structure prévisible.
- **1.4.3** Contrast (Minimum) : contraste ≥ 4,5:1 (texte normal).
- **2.1.1** Keyboard : toutes les fonctionnalités utilisables au clavier.
- **2.1.2** No Keyboard Trap : le focus peut quitter le menu mobile avec Échap.
- **2.4.1** Bypass Blocks : skip link vers le contenu principal.
- **2.4.6** Headings and Labels : titres et libellés descriptifs et hiérarchie cohérente.
- **3.3.2** Labels or Instructions : champs de formulaire étiquetés.
- **4.1.2** Name, Role, Value : sliders, boutons, accordéons avec nom/rôle/valeur corrects.
- **4.1.3** Status Messages : statuts dynamiques (sauvegarde, succès) annoncés via live region.

---

## 5. Ordre d’implémentation recommandé

1. **Phase 1 – Critique (1–2 jours)**  
   - Skip link + `id="main"` (layout + page + layouts jury/admin).  
   - Slider : props ARIA dans `slider.tsx` + usage dans `notation-form.tsx`.  
   - Notation form : labels/textarea (id, Label ou aria-label) + live region « Sauvegarde… ».  
   - Jury join form : fieldset + legend pour le PIN.

2. **Phase 2 – Important (1 jour)**  
   - Landmarks : `aria-label` sur les `<nav>`.  
   - Menu mobile : focus à l’ouverture/fermeture, Échap, optionnel focus trap.  
   - Boutons icon-only : audit + aria-label où nécessaire + doc Button.

3. **Phase 3 – Amélioration (1–2 jours)**  
   - FAQ : aria-controls + id.  
   - Audit contraste (outil + corrections).  
   - Audit titres (h1 unique, ordre h2/h3).

Après chaque phase : tests manuels au clavier (Tab, Enter, Espace, Échap) et avec un lecteur d’écran (NVDA/VoiceOver), puis vérification avec axe DevTools ou Lighthouse Accessibility.
