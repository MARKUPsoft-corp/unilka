# Guide d'Architecture & Bonnes Pratiques Clean Code — Projet unilka

> **Objectif** : Garantir un code modulaire, maintenable par un non-développeur, léger, sans fichiers volumineux et où chaque responsabilité est strictement isolée.

---

## 1. Principes Fondamentaux Clean Code

1. **Responsabilité Unique (Single Responsibility Principle - SRP)** :
   * Chaque fichier a un **rôle unique et précis**.
   * Un composant UI n'embarque pas la logique métier complexe.
   * La logique de validation et de compression vit dans des modules indépendants et réutilisables.

2. **Règle des Fichiers Courts (Zéro fichier volumineux)** :
   * **Seuil d'alerte :** Aucun fichier ne doit dépasser **150 à 200 lignes**.
   * Si un composant ou un script grandit, il doit être immédiatement décomposé en sous-composants ou fonctions d'aide (`helpers`).

3. **Composants Réutilisables & Atomiques** :
   * Les cartes, boutons, accordéons, alertes et étapes de formulaires ont chacun leur fichier dédié dans `src/components/`.
   * Tout pattern répété au moins deux fois devient un composant autonome.

4. **Source Unique de Vérité (Maintenance par un non-développeur)** :
   * Toutes les données d'entreprise (téléphone, courriel, zones, délais, assurances) sont centralisées dans `src/data/site-config.json`.
   * Modifier une information dans ce fichier la met à jour instantanément sur l'ensemble des 18 pages.

5. **Séparation Stricte : Données / Présentation / Comportement** :
   * **Données** : Fichiers JSON propres (`site-config.json`, `faq.json`, `services.json`).
   * **Présentation** : Composants modulaires (`.astro` / HTML sémantique).
   * **Comportement** : Scripts JavaScript modulaires et purs (`src/scripts/`).

---

## 2. Arborescence du Projet

```text
unilka/
├── public/                       # Fichiers statiques légers (robots.txt, favicon, etc.)
│   └── illustrations/            # SVG vectoriels créés sur-mesure (< 8 Ko chacun)
├── src/
│   ├── components/               # Composants UI modulaires
│   │   ├── common/               # Éléments récurrents de structure
│   │   │   ├── Header.astro      # En-tête avec navigation et bouton soumission
│   │   │   ├── Footer.astro      # Pied de page à 4 colonnes
│   │   │   ├── Breadcrumb.astro  # Fil d'Ariane sémantique
│   │   │   └── SkipLink.astro    # Lien d'évitement accessibilité
│   │   ├── cards/                # Cartes réutilisables (strictement isolées)
│   │   │   ├── ServiceCard.astro # Carte de présentation de service
│   │   │   ├── FeatureCard.astro # Carte avantage / « Pourquoi unilka »
│   │   │   ├── RegionCard.astro  # Carte de région desservie
│   │   │   ├── StepCard.astro    # Étape du processus « Comment ça se passe »
│   │   │   └── TrustBlock.astro  # Bloc conditionnel de tranquillité d'esprit
│   │   ├── ui/                   # Éléments d'interface de base
│   │   │   ├── Button.astro      # Boutons primaires / secondaires / alertes
│   │   │   ├── Accordion.astro   # Conteneur d'accordéon FAQ
│   │   │   ├── AccordionItem.astro # Question/réponse dépliable individuelle
│   │   │   ├── NoticeBox.astro   # Encadré d'information / avertissement / succès
│   │   │   └── CtaBanner.astro   # Bande d'appel à l'action
│   │   └── forms/                # Formulaires découpés par étape
│   │       ├── submission/       # Formulaire de soumission
│   │       │   ├── StepServiceType.astro   # Étape 1 : Choix du service & fréquence
│   │       │   ├── StepLocation.astro      # Étape 2 : Ville, code postal, adresse
│   │       │   ├── DetailsResidential.astro# Étape 3A : Options résidentielles
│   │       │   ├── DetailsCommercial.astro # Étape 3B : Options commerciales
│   │       │   ├── DetailsSpecialized.astro# Étape 3C : Options spécialisées
│   │       │   ├── UploadPhotos.astro      # Étape 3D : Zone photo avec miniatures
│   │       │   └── StepContact.astro       # Étape 4 : Coordonnées & consentements
│   │       └── candidate/        # Formulaire de candidature
│   │           ├── SectionIdentity.astro   # Section 1 : Informations personnelles
│   │           ├── SectionWorkAuth.astro   # Section 2 : Autorisation de travail
│   │           ├── SectionExperience.astro # Section 3-4 : Expérience & compétences
│   │           ├── SectionAvailability.astro # Section 5 : Jours, heures, plages
│   │           ├── SectionMobility.astro   # Section 6 : Véhicule & zones
│   │           └── SectionConsent.astro    # Section 7-8 : Formation & engagements
│   ├── data/                     # Source unique de vérité (fichiers éditables)
│   │   ├── site-config.json      # Coordonnées, régions, options d'assurance
│   │   ├── services.json         # Contenu et descriptif des 4 familles
│   │   ├── faq.json              # Les 14 questions/réponses clients & candidats
│   │   └── navigation.json       # Structure des menus et liens
│   ├── layouts/                  # Gabarits de page
│   │   ├── BaseLayout.astro      # Métadonnées, SEO, OpenGraph, ressources locales
│   │   └── PageLayout.astro      # Structure type (Header + Main + Breadcrumb + Footer)
│   ├── pages/                    # Les 18 pages du site (fichiers concis)
│   │   ├── index.astro
│   │   ├── services/
│   │   │   ├── index.astro
│   │   │   ├── nettoyage-residentiel.astro
│   │   │   ├── nettoyage-commercial.astro
│   │   │   ├── nettoyage-specialise.astro
│   │   │   └── entretien-regulier.astro
│   │   ├── soumission/
│   │   │   ├── index.astro
│   │   │   └── merci.astro
│   │   ├── zones-desservies.astro
│   │   ├── carrieres/
│   │   │   ├── index.astro
│   │   │   ├── inscription.astro
│   │   │   └── merci.astro
│   │   ├── a-propos.astro
│   │   ├── faq.astro
│   │   ├── contact.astro
│   │   ├── confidentialite.astro
│   │   ├── mentions-legales.astro
│   │   └── 404.astro
│   ├── scripts/                  # Logique métier pure (JS modulaire)
│   │   ├── photo-compressor.js   # Compression d'images côté client (< 1600px, < 6Mo)
│   │   ├── form-validator.js     # Validations (code postal canadien, regex, erreurs)
│   │   ├── conditional-fields.js # Affichage dynamique des sections de formulaire
│   │   └── mobile-nav.js         # Menu mobile accessible (clavier, Escape, ARIA)
│   └── styles/                   # Design Tokens & Styles globaux
│       ├── tokens.css            # Variables CSS (palette #0E7C86, #FFB703, espacements)
│       ├── typography.css        # Hiérarchie typographique fluide et lisible
│       └── global.css            # Réinitialisation & utilitaires légers
├── DECISIONS.md                  # Consignation des décisions d'architecture (D01-D22)
├── PROGRESS.md                   # Journal d'avancement des tâches (T-0.1 à T-6.4)
├── TODO-OWNER.md                 # Tâches réservées au propriétaire avant mise en ligne
├── QA-REPORT.md                  # Rapport d'audit de qualité et des 11 tests
└── CLEAN-CODE-GUIDELINES.md      # Ce document de référence
```

---

## 3. Règles d'Écriture du Code

### 3.1 Conventions de Nommage
* **Composants UI / Layouts** : `PascalCase.astro` (ex. `ServiceCard.astro`, `StepLocation.astro`).
* **Scripts utilitaires** : `kebab-case.js` (ex. `photo-compressor.js`, `form-validator.js`).
* **Fichiers de données** : `kebab-case.json` (ex. `site-config.json`, `faq.json`).
* **Variables CSS** : `--prefix-role` (ex. `--color-brand-primary`, `--space-4`, `--radius-md`).

### 3.2 Lisibilité & Découpage
* **Aucun HTML géant :** Une page `.astro` assemble des composants, elle ne contient pas 300 lignes de balisage brut.
* **Propriétés typées et documentées :** Chaque composant reçoit des `props` claires avec des valeurs par défaut pertinentes.
* **Commentaires fonctionnels :** Expliquer *pourquoi* une règle existe (ex. conformité Loi 25, règle de code postal canadien H2X 1Y4), pas seulement ce que fait le code.

### 3.3 Formulaires & Zéro Couplage
* La logique de soumission est scindée en fonctions pures :
  1. `validateField(field)` : retourne `{ valid: boolean, error: string }`.
  2. `compressImage(file)` : retourne une `Promise<Blob>`.
  3. `toggleConditionalBlocks(serviceType)` : active/désactive et vide les champs masqués.
* Chaque étape est un composant indépendant pouvant être testé isolément.

---

## 4. Règle d'Or de Maintenance
> **Tout ce qui peut changer dans la vie de l'entreprise (un numéro de téléphone, une ville desservie, l'ajout d'une assurance) ne doit JAMAIS être codé en dur dans le HTML.** 
> Il doit provenir de `src/data/site-config.json`. Si la donnée est vide ou non confirmée, le composant ne l'affiche tout simplement pas.
