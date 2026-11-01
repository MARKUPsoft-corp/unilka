# unilka® — Guide Officiel du Tableau de Bord Administratif
**Console de Direction & d'Exploitation Commerciale**  
*Document de référence aligné sur le cahier des charges fonctionnel (`unilka-description-fonctionnelle.md`)*

---

## 1. Vision Générale & Cohérence de Marque

Le tableau de bord d'administration de **unilka** a été conçu pour offrir aux dirigeants et coordinateurs d'opérations un outil de pilotage complet, élégant et rigoureusement connecté aux formulaires publics du site client.

### Principes Fondateurs
1. **Homogénéité Visuelle Absolue :** Même palette minérale noble que le site public (Teal profond `#0B2A2E`, Cyan signature `#0E7C86`, Ambre chaud `#FFB703`, Fond givré `#F5FAFA`, Blanc pur `#FFFFFF`) et typographie suisse géométrique `Manrope`.
2. **Règle Zéro Émoji (Strict Vector SVG) :** Pour garantir une allure logicielle d'entreprise haut de gamme et éliminer tout rendu automatisé ou amateur, **aucun émoji n'est utilisé**. L'ensemble de l'interface repose sur le composant vectoriel dédié `AdminIcon.astro` regroupant 28 icônes SVG précises et épurées.
3. **Mise en Valeur Photographique Réelle :** Intégration de photographies haute définition d'interventions réelles (condo luxueux d'Outremont, cabinet médical de Ville-Marie) et de portraits professionnels des préposé(e)s (`Fatou Diop`, `Jean-Marc Tremblay`).
4. **Visualisation de Données Métier :** Graphiques vectoriels natifs SVG (`AdminCharts.astro`) illustrant la trajectoire des revenus hebdomadaires, la ventilation des 4 familles de services et la décomposition financière des flux Stripe Canada (brut / commission 2,9% + 0,30 $ / net perçu).

---

## 2. Architecture & Pages de la Console

L'espace d'administration est structuré en 7 modules accessibles via la barre latérale permanente (avec tiroir coulissant sur mobile) :

| Route | Module | Fonctionnalités Clés |
|---|---|---|
| `/admin/` | **Vue d'ensemble** | 4 KPIs en temps réel, graphique SVG de revenus hebdomadaires, donut des services, interventions du jour avec photos d'équipe, demandes urgentes. |
| `/admin/soumissions/` | **Soumissions & Devis** | Filtrage par statut et secteur, tiroir latéral d'analyse (*slide-over drawer*), aperçu photo du lieu soumis, calculateur de devis avec taxes québécoises (TPS + TVQ), génération de liens Stripe. |
| `/admin/planning/` | **Planning & Missions** | Calendrier hebdomadaire interactif, cartes d'interventions avec photos des préposés, validation de la checklist hôtelière 42 points, codes d'accès sécurisés, disponibilité des équipes. |
| `/admin/clients/` | **Clients & Forfaits** | Annuaire des 42 clients réguliers, vignettes photographiques des résidences et commerces, préposé dédié cautionné, suivi des volumes mensuels récurrents, recherche en temps réel. |
| `/admin/equipe/` | **Équipe & Candidats** | Suivi du personnel terrain (enquêtes d'antécédents judiciaires, formations hôtelières), analyse des candidatures en ligne avec champs Section 8.2 (permis, transport, disponibilités, Loi 25). |
| `/admin/facturation/` | **Facturation & Stripe** | Historique des encaissements en $ CAD, graphique de décomposition des frais Stripe Canada (2,9% + 0,30 $), passerelle connectée (`acct_1QunilkaCA`), modale de génération de liens de paiement instantanés, émission de reçus PDF. |
| `/admin/parametres/` | **Paramètres & Site** | Gestion de l'identité légale (NEQ, marque, slogan, délai de réponse), coordonnées concierge, activation des 5 badges de confiance, régions desservies (Montréal, Rive-Sud, Lanaudière), gouvernance Loi 25 (DPO et durées de rétention). |

---

## 3. Alignement Détaillé avec le Cahier des Charges

Le tableau de bord transpose directement chaque exigence du cahier des charges fonctionnel (`unilka-description-fonctionnelle.md`) :

### A. Les 4 Familles de Services & Grille Tarifaire (Sections 7.1 à 7.6)
Le tableau de bord classe et traite automatiquement les 4 prestations définies :
- **Nettoyage résidentiel :** Grand ménage ponctuel, avant/après emménagement, nettoyage saisonnier.
- **Nettoyage commercial :** Entretien de cliniques, bureaux d'affaires, boutiques et espaces partagés.
- **Entretien régulier à forfait :** Passages hebdomadaires, bimensuels ou mensuels avec préposé(e) dédié(e).
- **Nettoyage spécialisé :** Injection-extraction pour canapés velours, carpettes de laine, matelas et véhicules.

### B. Prise en Compte des Spécifications Soumission (Section 8.1)
Dans `/admin/soumissions/`, la fiche d'analyse intègre fidèlement tous les champs saisis par le prospect :
- **Superficie et pièces :** pi² déclarés, nombre de chambres et salles de bain.
- **Évaluation de l'état des lieux :** Entretien régulier, nettoyage standard, nettoyage en profondeur ou remise en état majeure.
- **Photos jointes par le client (jusqu'à 3 photos) :** Affichage d'une visionneuse intégrée dans le tiroir d'analyse (`submission-condo.jpg` ou `submission-clinic.jpg`) avec mention du statut d'inspection visuelle.
- **Calculateur de devis officiel québécois :**
  - Heures estimées × Taux horaire de base ($/h).
  - Extras optionnels sélectionnables (Intérieur four / électros : +45 $, Vitres intérieures : +65 $).
  - Calcul fiscal conforme : **Sous-total HT + TPS (5%) + TVQ (9,975%) = Total TTC officiel**.
  - Action directe : **Copier le lien Stripe Canada** ou **Envoyer le devis officiel par courriel**.

### C. Recrutement & Profils Candidats (Section 8.2)
Dans `/admin/equipe/`, le traitement des candidatures reçues via `/carrieres/inscription/` affiche l'ensemble des critères d'admissibilité :
- **Autorisation de travail au Canada :** Citoyenneté, résidence permanente ou permis de travail valide.
- **Expérience hôtelière / entretien :** Années de pratique et établissements antérieurs.
- **Mobilité & Moyen de transport :** Véhicule personnel, permis de conduire valide ou transport en commun.
- **Disponibilités :** Jours ouvrables, fin de semaine, créneaux matin/après-midi/soir.
- **Formations souhaitées :** Protocoles sanitaires, éco-produits, techniques d'entretien commercial.
- **Consentement Loi 25 obligatoire :** Vérifié et horodaté dès la réception.

### D. Territoires & Régions Desservies (Section 7.7)
Le dashboard pilote les 3 zones géographiques officielles :
1. **Montréal :** Ville-Marie, Outremont, Westmount, Plateau-Mont-Royal, Rosemont, Griffintown, etc.
2. **Longueuil & Rive-Sud :** Brossard, Saint-Lambert, Boucherville, Longueuil.
3. **Lanaudière :** Terrebonne, Repentigny, Mascouche.

### E. Les 5 Badges de Sérénité & Confiance (Section 5.3)
Configurables et synchronisés dans `/admin/parametres/` :
1. *Responsabilité civile professionnelle :* Couverture de 2 000 000 $ CAD.
2. *Personnel cautionné & vérifié :* Équipe salariée, zéro sous-traitance opaque.
3. *Contrôle des antécédents judiciaires :* Enquête préalable systématique pour chaque intervenant.
4. *Produits éco-certifiés & non toxiques :* Sécurité garantie pour enfants, animaux et surfaces nobles.
5. *Protocole d'inspection 42 points :* Grille de standardisation palace appliquée avant toute remise de chantier.

### F. Gouvernance & Loi 25 sur la Protection des Données (Section 11)
Le module `/admin/parametres/` assure la conformité rigoureuse avec les lois québécoises :
- **Délégué à la Protection des Données (DPO) :** Nom et adresse de courriel officielle déclarés (`confidentialite@unilka.com`).
- **Durées de rétention programmées :**
  - **24 mois** pour les demandes de devis et dossiers clients.
  - **12 mois** pour les dossiers de recrutement et candidatures.
- **Droit d'accès et d'effacement :** Purge des données personnelles sur simple demande.

### G. Intégration Monétique Stripe Canada (Section 5.3)
Le module `/admin/facturation/` reflète le modèle économique réel :
- Compte marchand canadien connecté (`acct_1QunilkaCA`).
- Tarification standard Stripe Canada : **2,9% + 0,30 $ CAD** par transaction.
- Affichage visuel du volume brut facturé, des retenues de passerelle et du **versement net bancaire garanti**.
- Modale interactive pour générer en un clic des liens de paiement instantanés (Apple Pay, Google Pay, Cartes de crédit, Virement Interac).

---

## 4. Guide d'Utilisation Quotidienne

### Traiter une nouvelle demande de soumission
1. Ouvrez l'onglet **Soumissions & Devis** (`/admin/soumissions/`).
2. Cliquez sur une ligne de soumission (ex. `SOU-1042 - Alexandre Tremblay`).
3. Le tiroir coulissant s'ouvre : inspectez les photos transmises du chantier pour évaluer l'état des lieux.
4. Ajustez le nombre d'heures estimées et cochez les extras éventuels dans le calculateur.
5. Cliquez sur **Copier le lien Stripe Canada** pour l'intégrer au contrat, ou **Envoyer devis** pour transmettre la soumission formelle au client.

### Planifier une intervention et assigner un collaborateur
1. Accédez à l'onglet **Planning & Missions** (`/admin/planning/`).
2. Sélectionnez le jour de la semaine (ex. *Mardi 27 oct.*).
3. Consultez la colonne de droite pour vérifier les préposé(e)s disponibles sur ce secteur.
4. Cliquez sur **Changer le préposé** pour réassigner la mission en cas d'imprévu.
5. Une fois l'intervention achevée, cliquez sur **Valider checklist 42 pts** pour clore le dossier avec succès.

### Examiner les candidatures et planifier les entrevues
1. Accédez à l'onglet **Équipe & Candidats** (`/admin/equipe/`).
2. Examinez les 3 blocs de candidatures récentes : vérifiez la mobilité (voiture / transport) et l'autorisation de travail.
3. Cliquez sur **Appeler** pour un premier contact téléphonique, ou sur **Planifier entretien** pour fixer la rencontre formelle.

---

## 5. Résumé de la Qualité & Tests Automatisés

Le code a été audité et validé :
- **Audit Zéro Émoji :** 0 occurrence détectée sur l'intégralité du code source admin.
- **Banc d'essai automatisé (`npm test`) :** 11/11 scénarios QA validés (codes postaux canadiens, règles de contact, quotas de photos, validation Loi 25, routes API serverless).
- **Compilation de production (`npx astro build`) :** 26/26 routes compilées avec succès en 3,45 secondes.
- **Rendu Responsive :** Testé et validé sur écran Desktop (1440 × 900 px) et mobile (375 × 812 px).
