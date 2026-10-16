# Actions Requises du Propriétaire — TODO-OWNER.md

> Ce document liste avec précision tout ce que **seul le propriétaire de l'entreprise peut fournir ou décider** avant et après la mise en ligne du site **unilka**.
> 
> *Rappel : tant qu'une information n'a pas été confirmée et saisie dans `src/data/site-config.json`, le bloc correspondant sur le site reste automatiquement masqué pour ne jamais afficher de données inexactes ou provisoires.*

---

## 🔴 Priorité 1 — Indispensable avant la mise en ligne

Ces éléments sont légalement ou techniquement indispensables pour lancer le site.

| # | Élément | Pourquoi c'est indispensable | Où l'indiquer |
|---|---|---|---|
| 1 | **Courriel de réception des formulaires** | Sans cette adresse, aucune notification de soumission ou de candidature ne pourra vous être transmise. | Dans `src/data/site-config.json` (`business.formRecipientEmail`) et variable d'environnement Vercel |
| 2 | **Nom légal et NEQ** (Numéro d'entreprise du Québec) | Obligation légale pour les mentions légales et la transparence commerciale au Québec. | Dans `src/data/site-config.json` (`business.legalName` et `business.neq`) |
| 3 | **Coordonnées d'affaires** (téléphone, courriel, adresse/heures) | Permet aux clients de vous joindre directement. | Dans `src/data/site-config.json` (`business.phone`, `business.email`) |
| 4 | **Responsable de la protection des renseignements personnels** (Nom et courriel) | Obligation stricte de la **Loi 25 au Québec**. À défaut, la loi désigne d'office la personne ayant la plus haute autorité dans l'entreprise. | Dans `src/data/site-config.json` (`privacy.dpoName` et `privacy.dpoEmail`) |
| 5 | **Validation des zones desservies** (et liste des villes si souhaité) | Confirmer que les 3 régions (Montréal, Longueuil/Rive-Sud, Lanaudière) sont exactes, et lister les municipalités couvertes si vous souhaitez afficher la liste. | Dans `src/data/site-config.json` (`zones.regions` et `zones.cities`) |
| 6 | **Nom de domaine** (ex. `unilka.ca`) | Adresse officielle à configurer sur Vercel. | Dans `src/data/site-config.json` (`business.siteUrl`) et sur votre registrar / Vercel |
| 7 | **Comptes Vercel & Cloudinary** | Hébergement du site et stockage sécurisé des photos de soumission. | Créer les comptes gratuits et renseigner les clés secrètes dans Vercel |
| 8 | **Relecture juridique des pages légales** | Les textes de confidentialité et de mentions légales sont fournis comme base de travail et doivent être validés par un juriste. | Pages `/confidentialite/` et `/mentions-legales/` |

---

## 🟡 Priorité 2 — Éléments de confiance pour rassurer les clients

Chaque élément ci-dessous est actuellement désactivé (`false`). Il vous suffit de passer la valeur à `true` dans `src/data/site-config.json` dès que vous avez les justificatifs.

| Élément | Question à vous poser | Effet sur le site si confirmé (`true`) |
|---|---|---|
| **Assurance responsabilité** | L'entreprise possède-t-elle une police d'assurance responsabilité civile valide ? | Affiche le badge « Entreprise assurée » sur l'accueil |
| **Personnel cautionné** | Votre personnel ou vos collaborateurs sont-ils cautionnés ? | Affiche « Personnel cautionné » |
| **Vérification des antécédents** | Effectuez-vous une vérification des antécédents judiciaires du personnel ? | Affiche « Vérification des antécédents de notre personnel » |
| **Produits écologiques** | Utilisez-vous systématiquement des produits d'entretien écologiques certifiés ? | Affiche « Produits d'entretien écologiques » |
| **Formation interne** | Avez-vous un programme interne de formation aux techniques et à la sécurité ? | Affiche « Personnel formé aux techniques d'entretien » |
| **Délai de réponse** | Le délai de « 1 jour ouvrable » est-il tenable pour vous ? | Mis à jour dans `business.responseDelay` |
| **Fourniture des produits** | Qui fournit l'équipement et les produits (vous ou le client) ? | Réponse précisée lors de la soumission et FAQ |
| **Exclusions de service** | Confirmez-vous que vous ne traitez pas les grosses moisissures, punaises ou risques biologiques ? | Mentionné dans la FAQ |
| **Statut des candidats** | Recrutez-vous des salariés ou des travailleurs autonomes ? | Valider la conformité de la page `/carrieres/` |

---

## 🟢 Priorité 3 — Améliorations futures et visibilité

| Élément | Description |
|---|---|
| **Logo officiel définitif** | Remplacer le logotype vectoriel provisoire dès que votre graphiste vous aura livré les fichiers finaux. |
| **Fiche Google Business Profile** | Créer la fiche entreprise locale (type « zone de desserte ») pour booster votre présence Google Maps à Montréal et environs. |
| **Vrais avis clients** | Remplacer l'absence d'avis par de vrais témoignages de clients satisfaits (ne jamais inventer de faux avis). |
| **Photos réelles d'interventions** | Remplacer progressivement les illustrations vectorielles par de vraies photos de vos réalisations (avec autorisation des clients). |
