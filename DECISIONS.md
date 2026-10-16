# Registre des Décisions — Projet unilka

> Ce fichier consigne les choix techniques et l'ensemble des décisions par défaut (D01 à D22) définies dans la description fonctionnelle du projet.

---

## 1. Choix Technologiques & Justification (Section 0.2)

* **Frontend :** **Astro** (Mode Hybride SSG + SSR). Garantit le Zéro-JS par défaut pour les 16 pages de contenu, une vitesse d'affichage instantanée (< 150 Ko), un score Lighthouse supérieur à 95, un excellent SEO local et des capacités SSR pour sécuriser les appels API.
* **Hébergement & Logique Backend :** **Vercel & Vercel Serverless Functions** (via l'adaptateur officiel `@astrojs/vercel`). Tout le code (frontend et endpoints API `src/pages/api/*`) vit dans un dépôt unique et se déploie en continu.
* **Base de données :** **Google Firebase (Cloud Firestore)**. Base NoSQL pour le stockage sécurisé des demandes de soumission et des candidatures avec durées de conservation paramétrables.
* **Stockage Média :** **Cloudinary**. Gestion et optimisation automatique des photos transmises par les clients (max 3 photos par demande) sans saturer la base de données.
* **Notifications :** Déclenchées directement par les Serverless Functions Vercel lors de la réception d'un formulaire, avec récapitulatif complet et liens photos envoyés au courriel du propriétaire.
* **Styles & Design :** **CSS Tokens + Tailwind CSS**. Respect rigoureux de la charte graphique unilka (Turquoise `#0E7C86`, Jaune accent `#FFB703`) avec conformité WCAG 2.1 AA (contrastes $\ge 4.5:1$).
* **Évolutivité future :** Prêt pour intégration **Stripe** (paiement d'acomptes via endpoints Vercel) et **IA** (estimation de devis en streaming).
* **Documentation détaillée :** Voir [`TECH-STACK.md`](file:///home/markup/Documents/unilka/TECH-STACK.md) et [`CLEAN-CODE-GUIDELINES.md`](file:///home/markup/Documents/unilka/CLEAN-CODE-GUIDELINES.md).

---

## 2. Décisions par Défaut (D01 à D22)

Toutes les décisions ci-dessous sont appliquées avec le statut **« Appliquée par défaut »** conformément à la section 2 du cahier des charges :

| ID | Sujet dans la source | Décision appliquée par défaut | Statut |
|---|---|---|---|
| **D01** | Nom de la marque | La marque s'écrit **unilka** (minuscules) partout. Jamais « UNILKA » ni « unilka service ». Le nom légal complet n'apparaît que dans le pied de page et les mentions légales. | Appliquée |
| **D02** | Slogans | Slogan principal : **« La propreté qui fait toute la différence. »** Sous-slogan : **« Nous prenons soin de votre espace, vous profitez de votre temps. »** | Appliquée |
| **D03** | Zones desservies | Trois régions : **Montréal**, **Longueuil et Rive-Sud**, **Lanaudière**. Aucune liste de villes affichée tant que le propriétaire ne l'a pas confirmée. | Appliquée |
| **D04** | Réservation vs Soumission | **Soumission uniquement** (pas de réservation directe en ligne en v1). Vocabulaire : « Obtenir une soumission ». | Appliquée |
| **D05** | Statut des candidats | Page Carrières rédigée de façon **neutre** : « missions et emplois selon les besoins », sans promesse d'emploi permanent. | Appliquée |
| **D06** | Formulaires & photos | Formulaires **intégrés au site**, sans compte obligatoire pour le visiteur, upload de photos inclus, notification courriel au propriétaire. | Appliquée |
| **D07** | Langue du site | **Français québécois uniquement** pour la v1, structure prête pour l'anglais futur. | Appliquée |
| **D08** | Mesure d'audience | **Aucun cookie, aucun traceur, aucun outil tiers**. Pas de bandeau de consentement aux témoins nécessaire. | Appliquée |
| **D09** | Téléversement photos | **Photos facultatives**, maximum 3, compressées automatiquement côté client avant l'envoi (< 6 Mo au total). | Appliquée |
| **D10** | Collecte candidats | Suppression de la date de naissance complète (remplacée par « J'ai 18 ans ou plus »), suppression du statut d'immigration détaillé, cases de consentement obligatoires (Loi 25). | Appliquée |
| **D11** | Logotype | Création d'un **logotype vectoriel SVG provisoire** avec étincelle jaune en exposant sur le « a », en attendant le logo final du propriétaire. | Appliquée |
| **D12** | Tarification | **Aucun prix chiffré affiché**. Mention systématique : « tarif forfaitaire proposé après évaluation de vos besoins ». | Appliquée |
| **D13** | Limites d'intervention | Précision dans la FAQ des cas exclus (grosses moisissures, punaises de lit, matières dangereuses). | Appliquée |
| **D14** | Fenêtres | Fenêtres intérieures incluses ; extérieures **sur évaluation**. | Appliquée |
| **D15** | Délai de réponse | « 1 jour ouvrable » par défaut, conditionnel à la confirmation du propriétaire. | Appliquée |
| **D16** | Éléments de confiance | Bloc « Votre tranquillité d'esprit » masqué tant que le propriétaire n'a pas confirmé assurance, cautionnement ou formation. | Appliquée |
| **D17** | Qualification personnel | Utilisation de la formule neutre « des personnes sérieuses et compétentes ». | Appliquée |
| **D18** | Fréquence ponctuelle | Ajout de « Une seule fois (ponctuel) » en première option du formulaire de soumission. | Appliquée |
| **D19** | Plages horaires | Choix proposés : Matin, Après-midi, Soir, Flexible (sans promesse d'heure exacte). | Appliquée |
| **D20** | Champ redondant | Retrait de la question « Souhaitez-vous recevoir une soumission personnalisée ? » (redondante). | Appliquée |
| **D21** | Consentements | Cases de consentement des formulaires **strictement obligatoires** (conformité Loi 25). | Appliquée |
| **D22** | Conservation des données | Conservation par défaut : **24 mois** pour les soumissions, **12 mois** pour les candidatures. | Appliquée |
