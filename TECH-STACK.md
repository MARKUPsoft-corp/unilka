# Choix Technologiques & Justification de la Stack — Projet unilka

> Ce document consigne l'ensemble des choix d'architecture technique pour le projet **unilka**, les critères de décision, ainsi que la façon dont chaque brique répond aux exigences du cahier des charges fonctionnel et de la feuille de route.

---

## 1. Vue d'Ensemble de la Stack

| Couche | Technologie retenue | Rôle principal |
|---|---|---|
| **Frontend** | **Astro** (Mode Hybride : SSG + SSR) | Rendu des 18 pages, performances (< 150 Ko), SEO local, navigation instantanée |
| **Styles & Design** | **Design Tokens CSS + Tailwind CSS** | Respect strict de la charte graphique (#0E7C86, #FFB703), accessibilité WCAG 2.1 AA |
| **Hébergement & Serverless** | **Vercel** | Hébergement global sur CDN Edge, déploiement continu, **Vercel Serverless Functions** (routes API intégrées à Astro) |
| **Base de données** | **Google Firebase (Firestore)** | Stockage sécurisé des demandes de soumission et des candidatures |
| **Stockage Médias** | **Cloudinary** | Téléversement des photos de soumission, compression et optimisation automatique, CDN mondial |
| **Notifications Courriel** | **Resend / Nodemailer via Vercel Serverless** | Envoi immédiat du courriel récapitulatif au propriétaire à chaque soumission |
| **Paiement (Évolutif)** | **Stripe** | Gestion sécurisée des acomptes et forfaits d'entretien régulier via endpoints d'API |
| **Intelligence Artificielle (Évolutif)** | **Google Gemini / OpenAI API** | Endpoints de streaming pour devis intelligent ou assistant conversationnel |

---

## 2. Justification Détaillée par Composant

### 2.1 Le Frontend : Pourquoi Astro sur Vercel ?

1. **Performances & Exigence de légèreté (< 150 Ko) :**
   * Contrairement aux Single Page Applications (SPA) React classiques qui envoient plusieurs mégaoctets de scripts, Astro applique le **Zéro-JS par défaut**.
   * Les 16 pages de contenu statique sont pré-rendues en HTML pur. Temps de chargement < 1 seconde sur mobile, score Google Lighthouse visé : **98 à 100/100**.

2. **Référencement local (SEO à Montréal, Longueuil, Lanaudière) :**
   * Le contenu est instantanément lisible par les robots d'indexation sans nécessiter de rendu JavaScript côté navigateur.

3. **Architecture en Îlots (*Islands Architecture*) :**
   * Seules les pages de formulaires interactifs (`/soumission/` et `/carrieres/inscription/`) chargent la logique JavaScript nécessaire (validation, compression, upload).

4. **Intégration native Vercel Serverless :**
   * Avec l'adaptateur officiel `@astrojs/vercel`, les fichiers placés dans `src/pages/api/` deviennent automatiquement des **Serverless Functions Vercel** ultra-rapides.
   * Tout vit dans un **dépôt unique**, sans friction de déploiement séparé.

---

### 2.2 Vercel Serverless & Firebase Firestore

1. **Architecture Monorepo unifiée :**
   * Au lieu de gérer un projet Cloud Functions Firebase indépendant, la logique backend (validation côté serveur, notification par courriel, enregistrement Firestore) est exécutée par les Serverless Functions de Vercel.
   * Les clés secrètes (clés privées Firebase Admin, identifiants Cloudinary, clés d'envoi de mail) sont protégées dans les variables d'environnement Vercel (`Environment Variables`).

2. **Base de données NoSQL (Cloud Firestore) :**
   * Les Serverless Functions Vercel communiquent avec Firestore via le SDK sécurisé Firebase Admin.
   * Stockage structuré avec durées de conservation conformes à la Loi 25 (24 mois pour les soumissions, 12 mois pour les candidatures, décision D22).

3. **Déclenchement automatique des notifications :**
   * Dès que la fonction Vercel reçoit le formulaire et enregistre les données dans Firestore, elle déclenche immédiatement un courriel de notification au propriétaire avec le récapitulatif complet et les liens vers les photos Cloudinary.

---

### 2.3 Le Stockage Média : Pourquoi Cloudinary ?

1. **Sécurité & Efficacité :**
   * Les photos téléversées par les clients (max 3 photos par soumission) ne surchargent pas la base de données.
   * Téléversement direct depuis le navigateur via un *unsigned upload preset* sécurisé ou signature d'API.

2. **Traitement d'image à la volée :**
   * Redimensionnement, conversion en format WebP/AVIF et optimisation automatique pour un affichage léger lors de la consultation par le propriétaire.

---

## 3. Flux de Données Complet

```
[Visiteur sur /soumission/]
            │
            ▼
1. Saisie des informations & sélection des photos (max 3)
            │
            ▼
2. Compression locale dans le navigateur via Canvas HTML5 (photo-compressor.js)
            │
            ├──► Téléversement direct des photos ────────► [ Cloudinary ]
            │                                                      │
            ▼                                                      ▼ (Retourne URLs sécurisées)
3. Envoi du payload JSON complet ──────────────────────────► [ Vercel Serverless Function ]
                                                                   │ (src/pages/api/soumission)
                                                                   ├──► [ Enregistrement Firestore ]
                                                                   │
                                                                   └──► [ Envoi Courriel Propriétaire ]
```

---

## 4. Conformité aux Exigences Légales et Bonnes Pratiques

* **Loi 25 (Québec - Renseignements personnels) :** 
  * Seules les données indispensables sont collectées.
  * Pas de cookies ni de traceurs de navigation.
  * Les sous-traitants (Vercel, Google Firebase, Cloudinary) sont explicitement déclarés dans la politique de confidentialité.
* **Architecture Clean Code :**
  * Respect strict du fichier `CLEAN-CODE-GUIDELINES.md` : modularité, aucun composant de plus de 150-200 lignes, fichier central `src/data/site-config.json` pour la maintenance.
