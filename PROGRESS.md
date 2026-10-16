# Journal d'Avancement — PROGRESS.md

> Journal de suivi des tâches du projet **unilka** conformément à la feuille de route (Section 13 de `unilka-description-fonctionnelle.md`).

---

## Phase 0 — Préparation
- [x] **T-0.1** — Lecture exhaustive du document fonctionnel et création de `DECISIONS.md` avec D01 à D22.
- [x] **T-0.2** — Choix et justification de la pile technique (Astro hybride + Vercel Serverless + Firebase Firestore + Cloudinary), consignés dans `DECISIONS.md`, `TECH-STACK.md` et `CLEAN-CODE-GUIDELINES.md`.
- [x] **T-0.3** — Mise en place de la source unique de vérité `src/data/site-config.json` avec toutes les valeurs par défaut de la section 5.3.
- [x] **T-0.4** — Création de `PROGRESS.md` et `TODO-OWNER.md`.

---

## Phase 1 — Identité visuelle et squelette commun
- [x] **T-1.1** — Créer le logotype provisoire vectoriel (D11), configurer tokens CSS et typographie (Section 6).
- [x] **T-1.2** — Construire les composants communs : `Header`, `Footer`, navigation mobile réactive, sous-menu services, lien d'évitement, fil d'Ariane, bandeau CTA et cartes réutilisables.
- [x] **T-1.3** — Créer les 6 illustrations vectorielles SVG légères (< 3 Ko, sous la cible de 8 Ko) et le set d'icônes.

---

## Phase 2 — Pages de contenu (18 pages)
- [x] **T-2.1** — Page d'Accueil `/` (7.1) avec hero, 4 cartes de services, distinctions, bloc de confiance conditionnel et étapes.
- [x] **T-2.2** — Pages Services : vue d'ensemble `/services/` et 4 pages de détails (résidentiel, commercial, spécialisé, entretien régulier).
- [x] **T-2.3** — Page Zones desservies `/zones-desservies/` (7.7).
- [x] **T-2.4** — Page FAQ `/faq/` (7.8) avec 14 questions/réponses en accordéons accessibles.
- [x] **T-2.5** — Page Carrières `/carrieres/` (7.9).
- [x] **T-2.6** — Pages À propos `/a-propos/` et Contact `/contact/`.
- [x] **T-2.7** — Pages de confirmation (`/soumission/merci/`, `/carrieres/merci/`) et page 404 (`/404.html`).
- [x] **T-2.8** — Pages légales `/confidentialite/` (Loi 25) et `/mentions-legales/`.

---

## Phase 3 — Formulaires interactifs
- [x] **T-3.1** — Formulaire de soumission `/soumission/` (Section 8.1) avec 7 blocs modulaires.
- [x] **T-3.2** — Formulaire de candidature `/carrieres/inscription/` (Section 8.2) avec 6 blocs modulaires.
- [x] **T-3.3** — Logique d'affichage conditionnel (Section 9.1 et 10.2).
- [x] **T-3.4** — Validation en direct et affichage du récapitulatif d'erreurs accessible (Section 9.3).
- [x] **T-3.5** — Module de compression automatique des photos côté client (< 1600 px, total < 6 Mo, max 3 photos) et miniatures.
- [x] **T-3.6** — Envoi, redirection confirmation et endpoints serverless Vercel (`src/pages/api/soumission.ts`, `src/pages/api/candidature.ts`).
- [x] **T-3.7** — Dégradation gracieuse et accessibilité clavier (WCAG 2.1 AA).

---

## Phase 4 — Référencement (SEO) et conformité
- [x] **T-4.1** — Balises meta (titres avec tiret cadratin « — », descriptions < 155 car., OpenGraph, JSON-LD) sur les 18 pages.
- [x] **T-4.2** — Indexation, sitemap XML dynamique (`sitemap-index.xml`), robots.txt (exclusion des pages merci et 404).
- [x] **T-4.3** — Relecture et alignement des pages légales (Loi 25 québécoise et mentions légales).

---

## Phase 5 — Contrôle qualité & Recette
- [x] **T-5.1** — Contrôles de conformité (Section 14.1).
- [x] **T-5.2** — Exécution des 11 scénarios de test des formulaires (Section 14.2) validés par `npm test`.
- [x] **T-5.3** — Contrôles visuels et navigation mobile / clavier consignés dans `QA-REPORT.md`.
- [x] **T-5.4** — Relecture typographique et lexicale (zéro mot interdit, zéro placeholder « TODO » ou « lorem »).

---

## Phase 6 — Livraison
- [x] **T-6.1** — Rédaction du guide d'utilisation non-technicien (`GUIDE-UTILISATION.md`).
- [x] **T-6.2** — Mise à jour finale de `TODO-OWNER.md`.
- [x] **T-6.3** — Validation du build Vercel de production (`npx astro build` : code 0, 18 routes HTML + 2 serverless functions).
- [x] **T-6.4** — Rapport et synthèse finale de livraison.
