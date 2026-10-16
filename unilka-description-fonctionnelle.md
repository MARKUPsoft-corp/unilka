# unilka — Description fonctionnelle du projet et feuille de route

> **Version** : 2.0 — 16 octobre 2026
> **Source** : cahier de contenu `SITE_INTERNET_fin_unilka_100006.docx`
> **Destinataire** : un agent IA (ou un prestataire) chargé de livrer le site complet.
> **Portée de ce document** : il décrit **ce que le site doit être et faire** (contenu, parcours, formulaires, règles, conformité, qualité attendue). Il ne prescrit **aucune technologie** : le choix des outils, du code et de l'hébergement est laissé à l'agent.

---

## 0. Mode d'emploi pour l'agent (à lire en premier)

### 0.1 Ce que tu dois produire

1. **Le site complet**, prêt à être mis en ligne : les 18 pages de la section 5, les deux formulaires de la section 8, les textes de la section 7.
2. **Un guide d'utilisation simple**, écrit pour un non-technicien : comment modifier un texte ou une coordonnée, comment mettre le site en ligne, comment recevoir et retrouver les demandes.
3. `DECISIONS.md` : toutes les décisions prises (section 2) et tes choix techniques.
4. `TODO-OWNER.md` : ce que seul le propriétaire peut fournir ou faire (section 15).
5. `QA-REPORT.md` : le résultat des contrôles de la section 14.
6. Une **archive unique** contenant tout ce qui précède.

### 0.2 Liberté technique et exigences fonctionnelles

Tu choisis librement la technologie, l'organisation du code et l'hébergement. Note ton choix en quelques lignes dans `DECISIONS.md`. Ton choix doit respecter ces exigences :

- Le propriétaire **n'est pas développeur** : modifier un texte, une coordonnée ou une région desservie doit être simple et expliqué dans le guide.
- **Coût d'hébergement nul ou très faible.**
- **Les formulaires fonctionnent réellement** : chaque envoi déclenche un courriel de notification au propriétaire et reste consultable ensuite (photos comprises), sans que le visiteur ait besoin de créer un compte.
- **Aucun cookie, aucun suivi des visiteurs, aucune publicité.** Le site ne charge pas de contenu depuis d'autres sites (polices, images, outils de mesure) sauf si c'est indispensable au fonctionnement des formulaires.
- **Pages légères et rapides**, y compris sur un téléphone avec une connexion moyenne.
- **Utilisable sur téléphone, tablette et ordinateur** (le téléphone est l'appareil principal à viser).
- **Accessible** (section 12).

### 0.3 Règles impératives

1. **Autonomie.** Ne pose pas de question au propriétaire. Pour chaque point ambigu, applique la **décision par défaut** de la section 2, note-la dans `DECISIONS.md` et continue.
2. **Aucune invention de faits.** Tu ne dois jamais inventer : numéro de téléphone, courriel, adresse, NEQ, assurance, cautionnement, certification, ancienneté, nombre de clients, avis clients, prix, noms de personnes, villes desservies non confirmées. Quand une information manque, le bloc qui l'utiliserait **n'est pas affiché** (jamais de texte provisoire visible du public).
3. **Langue.** Français du Québec, vouvoiement, ton chaleureux et professionnel. Orthographe et typographie soignées (espace insécable avant « : » et à l'intérieur des guillemets « »).
4. **Pas de photos de banque d'images.** Utilise des icônes et illustrations simples que tu crées toi-même (section 6.6).
5. **Journal d'avancement.** Tiens à jour `PROGRESS.md` : après chaque tâche de la section 13, ajoute une ligne `[x] T-x.y — résumé`.
6. **Validation par phase.** Ne passe à la phase suivante que si tous les critères d'acceptation de la phase en cours sont vérifiés.
7. **Ne jamais écrire de secret** (mot de passe, clé d'accès) dans les livrables.

### 0.4 Définition de « terminé »

- Les 18 pages de la section 5 existent et s'affichent correctement.
- Les deux formulaires respectent la section 8 champ par champ et se comportent comme décrit en section 9, **et un envoi de test a bien produit une notification** (ou, si l'agent ne peut pas l'envoyer lui-même, la procédure de test est documentée dans le guide).
- Tous les contrôles de la section 14 sont exécutés et consignés dans `QA-REPORT.md`.
- `TODO-OWNER.md` liste précisément ce qui reste à fournir.
- L'archive finale est produite.

---

## 1. Comprendre le projet

### 1.1 L'entreprise

**unilka** est une entreprise de **services de nettoyage professionnels** basée dans la région de **Montréal** (Québec, Canada). Elle intervient chez les particuliers, les entreprises et les propriétaires. Son positionnement : *vous faire gagner du temps* en offrant un service **professionnel, prompt et personnalisé**.

Services (4 familles) :

| Famille | Contenu principal |
|---|---|
| Nettoyage résidentiel | Cuisine, salles de bain, planchers, poussière, fenêtres intérieures, grand ménage, avant/après déménagement, entretien régulier |
| Nettoyage commercial | Bureaux, commerces, locaux professionnels, espaces communs, immeubles locatifs, après travaux ou rénovation, horaires d'entretien réguliers |
| Nettoyage spécialisé | Canapés et fauteuils, tapis et carpettes, matelas, intérieur de véhicules, surfaces très sales, après longue inoccupation |
| Entretien régulier à tarif forfaitaire | Fréquences : chaque semaine, aux 2 semaines, aux 3 semaines, une fois par mois, selon les besoins. Tarif forfaitaire proposé **après évaluation** |

### 1.2 Le site : deux publics, deux parcours

Le site sert **deux publics distincts**, avec deux parcours qui ne doivent jamais se mélanger :

**Public A — Visiteurs et clients** (cœur commercial du site)
- But : comprendre l'offre, vérifier que leur secteur est desservi, **demander une soumission**.
- Parcours type : Accueil → Service pertinent → Formulaire de soumission → Page de confirmation.
- Conversion principale : **soumission envoyée**.

**Public B — Chercheurs d'emploi** (alimente l'entreprise en main-d'œuvre)
- But : comprendre ce que l'entreprise offre, **s'inscrire** avec profil, disponibilités, secteur.
- Parcours type : Accueil (lien discret) ou Carrières → Formulaire d'inscription → Page de confirmation.
- Conversion secondaire : **candidature envoyée**.

### 1.3 Fonctionnement opérationnel (ce que le site déclenche)

Chaque formulaire envoie une notification par courriel au propriétaire ; les demandes restent aussi consultables à un endroit simple d'accès pour lui.

```
Client remplit le formulaire ─► Notification courriel au propriétaire
        │                              │
        ▼                              ▼
Page de confirmation          Le propriétaire contacte le client,
(délai de réponse annoncé)    évalue, envoie la soumission, planifie

Candidat remplit le formulaire ─► Notification courriel
        │                              │
        ▼                              ▼
Page de confirmation          Sélection, entretien, intégration
```

### 1.4 Indicateurs de succès (mesurés sans cookie ni suivi des visiteurs, voir D08 : ils se déduisent des demandes reçues)

- Nombre de soumissions de service par mois.
- Nombre de candidatures par mois.
- Taux de soumissions complètes (champs clés remplis : service, ville, fréquence, date).
- Répartition des demandes par type de service et par zone.

### 1.5 Risques identifiés dans le document source

1. Incohérences de nom, de slogan et de zone → réglées par les décisions D01 à D03.
2. Formulaires prévus sur Google Forms : l'envoi de photos y exige une connexion Google pour le visiteur, ce qui bloquerait la majorité des clients → réglé par D06 et D09.
3. Formulaire candidat qui collecte des renseignements sensibles (date de naissance complète, situation d'immigration) → réglé par D10.
4. Promesses de « personnel qualifié » et « emplois permanents » difficilement défendables sans preuve → réglé par D05 et la règle 0.2-2.
5. Aucune politique de confidentialité alors que le site collecte des renseignements personnels (obligation en vertu de la Loi 25 au Québec) → réglé en section 12.
6. Un cahier de contenu sans description des attentes fonctionnelles (objectifs, parcours, règles des formulaires, conformité) → ce document les ajoute.

---

## 2. Décisions par défaut (à appliquer sans demander)

Chaque ligne indique le problème trouvé dans le document source et la décision à appliquer.

| ID | Problème dans la source | Décision par défaut |
|---|---|---|
| D01 | Nom écrit « UNILKA », « unilka », « unilka service » | La marque s'écrit **unilka** (minuscules) partout. Jamais « unilka service ». Le nom légal complet, s'il est fourni, n'apparaît que dans le pied de page et les mentions légales |
| D02 | Deux slogans (brouillon et version rédigée) | Slogan principal : **« La propreté qui fait toute la différence. »** Sous-slogan : **« Nous prenons soin de votre espace, vous profitez de votre temps. »** |
| D03 | Zone : « Montréal et Longueuil », « Montréal et environs », « Montréal et Lanaudière » | Trois **régions** : **Montréal**, **Longueuil et Rive-Sud**, **Lanaudière**. Pas de liste de villes publique tant que le propriétaire ne la fournit pas : le visiteur indique sa ville ou son code postal dans le formulaire et la disponibilité lui est confirmée |
| D04 | Une « partie réservation » est mentionnée, mais seul un devis est décrit | **Soumission uniquement** (pas de réservation en ligne dans cette première version). Tous les boutons d'action mènent au formulaire de soumission. Vocabulaire : « Obtenir une soumission » |
| D05 | Statut des travailleurs non défini (employés ? autonomes ? « soumissionner » ?) | Page Carrières rédigée de façon **neutre** : « missions et emplois selon les besoins », sans promesse d'emploi permanent, avec l'avertissement que l'inscription ne garantit rien |
| D06 | Formulaires prévus sur Google Forms (envoi de photos impossible sans compte Google) | Formulaires **intégrés au site**, sans compte pour le visiteur, photos incluses, avec notification par courriel |
| D07 | Aucune mention de langue | **Français uniquement** dans cette première version, structure prête à accueillir l'anglais plus tard |
| D08 | Aucune mention de mesure d'audience | **Aucun cookie, aucun suivi** (donc pas de bandeau de consentement aux témoins) |
| D09 | Photos demandées dans le brouillon, absentes de la version finale | **Photos facultatives**, 3 au maximum, réduites automatiquement à une taille raisonnable |
| D10 | Formulaire candidat trop intrusif | Retirer la **date de naissance** (remplacée par la case « J'ai 18 ans ou plus »), retirer « Votre situation au Canada » (doublon), garder « autorisé(e) à travailler au Canada », retirer la **signature** (remplacée par des cases de consentement) |
| D11 | Aucun logo ni charte graphique | Créer un **logotype provisoire** et la charte de la section 6 ; le signaler dans `TODO-OWNER.md` |
| D12 | « Tarif forfaitaire » sans prix | **Aucun prix affiché.** Formule : « tarif forfaitaire proposé après évaluation de vos besoins » |
| D13 | Aucune limite de service indiquée | Texte d'exclusion prudent dans la FAQ : certaines situations (moisissure importante, punaises de lit, risques biologiques) relèvent de services spécialisés **non offerts**. À confirmer par le propriétaire |
| D14 | Fenêtres : « intérieures » (services) contre « extérieures » (formulaire) | Intérieures incluses ; extérieures **sur évaluation** |
| D15 | Délai de réponse non précisé | « 1 jour ouvrable » par défaut, à confirmer. Si aucun délai n'est confirmé, phrase générique : « Nous communiquons avec vous rapidement » |
| D16 | Aucun élément de confiance (assurance, cautionnement, vérification d'antécédents) | Bloc **« Votre tranquillité d'esprit »** affiché **seulement** pour les éléments que le propriétaire confirme (tous « non confirmés » par défaut) |
| D17 | « Personnel qualifié » contredit par le recrutement de débutants | Utiliser « des personnes sérieuses et compétentes » (formulation de la source). Ne parler de formation interne que si le propriétaire la confirme |
| D18 | Fréquence « ponctuelle » absente du formulaire | **Ajouter** « Une seule fois (ponctuel) » en tête de liste |
| D19 | Plages horaires non définies | Matin, Après-midi, Soir, Flexible (aucune heure précise promise) |
| D20 | Question « Souhaitez-vous recevoir une soumission personnalisée ? » | **Retirée** : redondante, tout le formulaire sert à obtenir une soumission |
| D21 | Cases de consentement du formulaire candidat facultatives | **Obligatoires** : sans elles, la candidature ne peut pas être traitée |
| D22 | Durée de conservation des données non définie | Par défaut : demandes de soumission **24 mois**, candidatures **12 mois** (à confirmer par le propriétaire) |

---

## 3. Objectifs et cibles du site

### 3.1 Objectifs

1. **Générer des demandes de soumission qualifiées** (service, ville, fréquence, état du lieu, date).
2. **Rassurer** : montrer le sérieux, expliquer le déroulement, afficher les preuves de confiance disponibles.
3. **Constituer un bassin de candidats** triés par disponibilité, secteur, mobilité.
4. **Être trouvé localement** (« nettoyage Montréal », « ménage Longueuil », etc.) via un SEO local propre.
5. **Être simple à maintenir** sans compétences techniques avancées.

### 3.2 Personas (pour guider la rédaction et l'ergonomie)

| Persona | Besoin | Frein principal | Ce que le site doit faire |
|---|---|---|---|
| **Marie, 38 ans, famille, condo à Montréal** | Un ménage régulier fiable | Confiance : faire entrer quelqu'un chez elle | Montrer déroulement, sérieux, personnalisation, formulaire court |
| **Karim, gestionnaire de petit commerce** | Entretien régulier hors heures | Flexibilité d'horaire, devis clair | Page commerciale, option « hors heures » dans le formulaire |
| **Sophie, propriétaire d'un duplex** | Nettoyage avant/après locataires | Rapidité | Mettre en avant « avant ou après un déménagement » et « locaux après travaux » |
| **Jean, étudiant** | Revenu complémentaire flexible | Horaires, démarche simple | Page Carrières claire, formulaire sans friction, mobile d'abord |

### 3.3 Hors périmètre (v1)

Paiement en ligne, réservation avec calendrier, espace client, blogue, version anglaise, calculateur de prix automatique, application mobile, tableau de bord administrateur maison.

---

## 4. Principes de conception

1. **Mobile d'abord** : la majorité des visiteurs viendront d'un téléphone.
2. **Une action principale par page** : « Obtenir une soumission » (clients) ou « Je m'inscris » (candidats).
3. **Séparation nette des deux publics** : navigation principale orientée client ; lien « Emplois » distinct, toujours visible mais secondaire.
4. **Formulaires en étapes lisibles** : sections courtes, champs conditionnels, messages d'erreur clairs.
5. **Rapidité** : pages légères et rapides à s'afficher.
6. **Honnêteté du contenu** : jamais de promesse que l'entreprise ne peut pas prouver.

---

---

## 5. Structure du site (18 pages)

| # | URL | Public | Rôle |
|---|---|---|---|
| 1 | `/` | A + B | Accueil : présentation, services, confiance, accès aux deux parcours |
| 2 | `/services/` | A | Vue d'ensemble des 4 familles de services |
| 3 | `/services/nettoyage-residentiel/` | A | Détail résidentiel |
| 4 | `/services/nettoyage-commercial/` | A | Détail commercial |
| 5 | `/services/nettoyage-specialise/` | A | Détail spécialisé |
| 6 | `/services/entretien-regulier/` | A | Entretien régulier à tarif forfaitaire |
| 7 | `/soumission/` | A | **Formulaire de demande de soumission** |
| 8 | `/soumission/merci/` | A | Confirmation (non référencée) |
| 9 | `/zones-desservies/` | A | Régions desservies |
| 10 | `/carrieres/` | B | Page « Rejoignez notre équipe » |
| 11 | `/carrieres/inscription/` | B | **Formulaire de candidature** |
| 12 | `/carrieres/merci/` | B | Confirmation (non référencée) |
| 13 | `/a-propos/` | A | Mission et valeurs (uniquement ce que la source affirme) |
| 14 | `/faq/` | A + B | Questions fréquentes |
| 15 | `/contact/` | A + B | Coordonnées (blocs conditionnels) |
| 16 | `/confidentialite/` | A + B | Politique de confidentialité |
| 17 | `/mentions-legales/` | A + B | Mentions légales et conditions d'utilisation |
| 18 | `/404.html` | — | Page introuvable (non référencée) |

### 5.1 Navigation

**En-tête (toutes les pages)** : logo `unilka` (lien vers `/`) · Services · Zones desservies · À propos · FAQ · Contact · **Emplois** (lien secondaire) · **bouton « Obtenir une soumission »** (toujours visible, y compris dans le menu mobile).

**Sous-menu Services** : les 4 familles (affiché au survol/focus sur ordinateur, liste dépliée dans le menu mobile).

**Pied de page (4 colonnes)** :
1. Logo + slogan + phrase de zone.
2. Services (4 liens).
3. Entreprise : À propos, Zones desservies, FAQ, Contact, Emplois.
4. Légal : Confidentialité, Mentions légales. Coordonnées (si disponibles).

**Fil d'Ariane** sur toutes les pages sauf l'accueil,.

### 5.2 Parcours et boutons d'action

| Page | CTA principal | CTA secondaire |
|---|---|---|
| Accueil | Obtenir une soumission → `/soumission/` | Voir nos services → `/services/` ; bande « Vous cherchez un emploi ? » → `/carrieres/` |
| Pages de services | Obtenir une soumission | Retour aux services |
| Zones desservies | Vérifier mon secteur → `/soumission/` | — |
| Carrières | Je m'inscris maintenant → `/carrieres/inscription/` | FAQ |
| Contact | Obtenir une soumission ; Je m'inscris | — |

### 5.3 Informations de l'entreprise à rendre faciles à modifier

Toutes ces informations doivent être modifiables **à un seul endroit** par le propriétaire (voir le guide d'utilisation) et se répercuter partout où elles apparaissent.

| Information | Valeur par défaut | Utilisée dans |
|---|---|---|
| Nom commercial | unilka | Partout |
| Nom légal | (vide) | Pied de page, mentions légales |
| Slogan et sous-slogan | Voir D02 | Accueil, à propos |
| Adresse du site (domaine) | (vide) | Plan du site, informations pour les moteurs de recherche |
| Téléphone, courriel, adresse, heures d'ouverture | (vides) | Contact, pied de page |
| Délai de réponse | 1 jour ouvrable | Contact, page de confirmation |
| Courriel de réception des formulaires | (vide, **obligatoire avant la mise en ligne**) | Notifications |
| NEQ | (vide) | Mentions légales |
| Responsable de la protection des renseignements personnels : nom et courriel | (vides) | Politique de confidentialité |
| Durées de conservation | 24 mois (clients), 12 mois (candidats) | Politique de confidentialité |
| Régions desservies | Montréal ; Longueuil et Rive-Sud ; Lanaudière | Accueil, zones desservies, FAQ |
| Villes desservies | (vide) | Zones desservies (bloc affiché seulement si rempli) |
| Éléments de confiance confirmés : assurance, cautionnement, vérification des antécédents, produits écologiques, formation interne | Tous « non confirmés » | Accueil (bloc de confiance, affiché seulement pour les éléments confirmés) |
| Réseaux sociaux, fiche d'entreprise Google | (vides) | Pied de page (liens affichés seulement si fournis) |

**Règle générale** : toute information absente entraîne la disparition propre du bloc concerné, sans trace de texte provisoire.

---

## 6. Identité visuelle et ergonomie

### 6.1 Impression recherchée
Propre, frais, fiable, chaleureux. Pas de ton « corporatif froid ».

### 6.2 Logo provisoire (D11)
Le mot « unilka » en minuscules, gras, en couleur principale, avec une petite étincelle à quatre branches de couleur jaune placée en exposant à droite du « a ». Prévoir une version claire pour fond foncé et une petite icône d'onglet. À remplacer par le logo définitif quand le propriétaire le fournira.

### 6.3 Couleurs

| Rôle | Couleur | Usage |
|---|---|---|
| Principale | turquoise profond `#0E7C86` | Boutons principaux, liens, logo |
| Principale foncée | `#0A5A62` | Survol, titres forts, anneau de focus |
| Principale très claire | `#E3F4F5` | Fonds de sections et cartes |
| Accent | jaune `#FFB703` | Étincelle, soulignements, badges, bouton sur fond coloré |
| Texte principal | `#0B2A2E` | Corps de texte |
| Texte secondaire | `#3D5A5E` | Textes d'aide |
| Fonds | blanc et `#F5FAFA` | Pages et sections alternées |
| Succès | `#1B7F4B` | Messages de réussite |
| Erreur | `#B3261E` | Messages d'erreur |

**Exigence de lisibilité** : tous les couples texte/fond doivent atteindre au moins 4,5 pour 1 de contraste (7 pour 1 pour le texte principal sur fond blanc). Si une couleur échoue, l'assombrir jusqu'à réussir et noter la valeur finale dans `DECISIONS.md`.

### 6.4 Typographie
Police sans empattement très lisible, déjà présente sur l'appareil du visiteur. Texte courant confortable (environ 17 px sur mobile), titres nettement hiérarchisés, lignes de texte limitées à environ 70 caractères.

### 6.5 Éléments d'interface à prévoir
- **En-tête fixe** avec logo, navigation et bouton « Obtenir une soumission » toujours visible, y compris dans le menu du téléphone.
- **Lien d'évitement** « Aller au contenu principal » pour les utilisateurs du clavier.
- **Bandeau d'accueil** : titre, slogan, deux boutons, une illustration.
- **Cartes de service** : icône, titre, deux lignes, lien « En savoir plus ».
- **Listes à coches** pour les services inclus.
- **Étapes numérotées** (« Comment ça se passe »).
- **Bloc de confiance** (affiché seulement pour les éléments confirmés).
- **FAQ dépliable** (une question à la fois lisible, réponse masquée jusqu'au clic).
- **Bande d'appel à l'action** en couleur principale.
- **Formulaires** : étiquettes visibles au-dessus des champs, champs confortables à toucher (hauteur d'au moins 48 px), groupes de choix avec légende, aide discrète sous le champ, erreurs sous le champ.
- **Encadrés** d'information, d'erreur et de succès : toujours une icône **et** du texte, jamais la couleur seule.
- **Fil d'Ariane** sur toutes les pages sauf l'accueil.
- **Pied de page** : 4 colonnes sur ordinateur, 1 colonne sur téléphone.

### 6.6 Illustrations
Six illustrations simples en style plat, aux couleurs de la charte, créées par l'agent : (1) bandeau d'accueil (pièce propre, bulles, étincelles), (2) maison, (3) commerce ou bureau, (4) canapé ou tapis, (5) calendrier ou répétition, (6) équipe ou poignée de main pour la page Carrières. Les illustrations purement décoratives ne doivent pas être annoncées par les lecteurs d'écran ; les autres ont un texte alternatif.

### 6.7 Comportements attendus
- Menu du téléphone : s'ouvre et se ferme au toucher, se ferme avec la touche Échap.
- Défilement doux vers les ancres, désactivé pour les personnes qui ont demandé moins d'animations.
- Le site, y compris les formulaires, doit **rester utilisable** même si certaines fonctions d'affichage ne se chargent pas.

---
## 7. Contenu page par page (textes finaux en français)

**Conventions** : les textes entre `...` sont à reprendre **tels quels** (ils corrigent et unifient la source). `[Si confirmé]` = ligne affichée seulement si le propriétaire a confirmé l'information. Chaque page a **un seul titre principal**. Ne rien ajouter qui ressemble à un fait vérifiable.

### 7.1 Accueil (`/`)

**Hero**
- Titre principal : `Nettoyage professionnel à Montréal et environs`
- Slogan (paragraphe d'accroche) : `La propreté qui fait toute la différence.`
- Texte : `Nous offrons des services de nettoyage professionnels adaptés aux besoins des particuliers, des entreprises et des propriétaires. Entretien régulier, grand ménage ou service spécialisé : notre équipe vous offre un résultat impeccable, avec professionnalisme et efficacité.`
- Boutons : `Obtenir une soumission` (primaire, `/soumission/`) · `Voir nos services` (secondaire, `/services/`)

**Section « Notre approche »** (Intertitre : `Nous prenons soin de votre espace, vous profitez de votre temps`)
`Chez unilka, nous croyons qu'un espace propre et bien entretenu contribue directement au confort, au bien-être et à la qualité de vie. Notre objectif est simple : vous faire gagner du temps et vous offrir un environnement propre, sain et agréable.`

**Section « Nos services »** (Intertitre : `Des services adaptés à chaque espace`) — 4 cartes :
1. `Nettoyage résidentiel` — `Maison, appartement, condo ou logement : profitez pleinement de votre espace.` → `/services/nettoyage-residentiel/`
2. `Nettoyage commercial` — `Bureaux, commerces et locaux professionnels : un environnement de travail propre pour vos équipes et vos clients.` → `/services/nettoyage-commercial/`
3. `Nettoyage spécialisé` — `Canapés, tapis, matelas, intérieur de véhicules et surfaces particulièrement sales.` → `/services/nettoyage-specialise/`
4. `Entretien régulier` — `Une fréquence adaptée à vos besoins, avec un tarif forfaitaire proposé après évaluation.` → `/services/entretien-regulier/`

**Section « Pourquoi unilka »** (Intertitre : `Ce qui nous distingue`) — 4 blocs :
- `Un service professionnel` — `Nous accordons une grande importance à la qualité de chaque intervention. Notre objectif est de vous offrir un service professionnel, organisé et adapté à vos attentes.`
- `Des personnes sérieuses et compétentes` — `Nous travaillons avec des personnes sérieuses et compétentes afin de vous offrir une expérience de nettoyage sécuritaire et satisfaisante.`
- `Promptitude et efficacité` — `Nous respectons les horaires convenus et nous nous efforçons d'effectuer chaque intervention avec efficacité, sans compromettre la qualité du travail.`
- `Un service personnalisé` — `Chaque client et chaque espace sont différents. C'est pourquoi nous prenons le temps de comprendre vos besoins afin de vous proposer une solution adaptée.`

**Bloc « Votre tranquillité d'esprit »** (affiché seulement si au moins un élément est confirmé par le propriétaire ; chaque ligne selon sa confirmation) :
- [Si confirmé] `Entreprise assurée`
- [Si confirmé] `Personnel cautionné`
- [Si confirmé] `Vérification des antécédents de notre personnel`
- [Si confirmé] `Produits d'entretien écologiques`
- [Si confirmé] `Personnel formé aux techniques d'entretien et à l'utilisation sécuritaire des produits`

**Section « Comment ça se passe »** (Intertitre : `Obtenir une soumission en 4 étapes`) :
1. `Vous remplissez le formulaire` — `Quelques minutes suffisent. Vous pouvez joindre des photos si vous le souhaitez.`
2. `Nous analysons votre demande` — `Notre équipe communique avec vous pour confirmer les détails du service.`
3. `Vous recevez une soumission personnalisée` — `Adaptée à votre espace, à son état et à la fréquence souhaitée.`
4. `Nous intervenons` — `À la date convenue, avec le souci du détail.`

**Section « Où intervenons-nous ? »** : `Nous desservons Montréal, Longueuil et la Rive-Sud, ainsi que Lanaudière. La disponibilité peut varier selon la ville, le type de service et la distance.` Lien : `Voir les zones desservies` → `/zones-desservies/`.

**Bande « Emplois »** (Intertitre : `Vous cherchez un emploi ou un revenu complémentaire ?`) : `Rejoignez notre équipe : missions ponctuelles, temps partiel ou temps plein selon vos disponibilités.` Bouton : `Voir les opportunités` → `/carrieres/`.

**Bande finale** : `Besoin d'un nettoyage ?` / `Obtenez une évaluation de vos besoins en quelques étapes.` / bouton `Obtenir une soumission`.

### 7.2 Services — vue d'ensemble (`/services/`)

- Titre principal : `Nos services de nettoyage`
- Introduction : `Que vous ayez besoin d'un entretien régulier, d'un grand nettoyage ou d'un service spécialisé, notre équipe vous offre un résultat impeccable. Chaque intervention est adaptée à votre espace et à vos besoins.`
- Quatre sections (Intertitre = nom du service) reprenant le texte d'introduction de chaque page de détail (7.3 à 7.6) et un lien `En savoir plus`.
- Bande finale : voir 7.1.

### 7.3 Nettoyage résidentiel (`/services/nettoyage-residentiel/`)

- Titre principal : `Nettoyage résidentiel à Montréal et environs`
- Introduction : `Nous prenons soin de votre maison, appartement, condo ou logement afin de vous permettre de profiter pleinement de votre espace.`
- Intertitre `Ce que nos services peuvent comprendre` (liste à coches) : Nettoyage de la cuisine · Nettoyage des salles de bain · Époussetage des surfaces · Nettoyage des planchers · Nettoyage des chambres et des espaces communs · Nettoyage des fenêtres intérieures · Nettoyage des surfaces et des appareils · Grand ménage · Nettoyage avant ou après un déménagement · Entretien régulier
- Paragraphe : `Chaque intervention peut être adaptée selon vos besoins et l'état de votre logement.`
- Intertitre `Pour quels types de logements ?` : `Appartements, condos, maisons, duplex et autres types de logements.`
- Intertitre `L'état de votre logement`, texte : `Pour vous proposer une soumission juste, nous vous demandons d'indiquer l'état actuel de votre logement : entretien régulier, nettoyage standard, nettoyage en profondeur, ou logement très sale nécessitant une intervention importante. Vous pouvez aussi joindre quelques photos.`
- Intertitre `Et les fenêtres ?` : `Le nettoyage des fenêtres intérieures est inclus dans nos services. Pour les fenêtres extérieures, nous évaluons chaque situation avant de vous proposer une solution.`
- Étapes (3) : `Vous décrivez votre besoin` → `Nous confirmons les détails avec vous` → `Nous intervenons à la date convenue`.
- Bande finale : `Prêt à profiter de votre temps ?` + bouton.

### 7.4 Nettoyage commercial (`/services/nettoyage-commercial/`)

- Titre principal : `Nettoyage commercial à Montréal et environs`
- Introduction : `Un environnement de travail propre contribue à offrir une meilleure expérience aux employés, aux clients et aux visiteurs.`
- Intertitre `Nous proposons des services de nettoyage pour` (liste) : Bureaux · Commerces · Locaux professionnels · Petites entreprises · Espaces communs · Immeubles et espaces locatifs · Locaux après travaux ou rénovation
- Intertitre `Un horaire d'entretien adapté` : `Nous pouvons établir un horaire d'entretien régulier afin de maintenir vos locaux propres en tout temps. Précisez vos contraintes d'horaire dans votre demande : nous vous indiquerons ce que nous pouvons vous offrir.`
- Intertitre `Propriétaires et gestionnaires d'immeubles` : `Entre deux locataires ou après des travaux, nous vous aidons à remettre vos espaces en état.`
- Bande finale + bouton.

### 7.5 Nettoyage spécialisé (`/services/nettoyage-specialise/`)

- Titre principal : `Nettoyage spécialisé : canapés, tapis, matelas et véhicules`
- Introduction : `Certains espaces et certaines surfaces nécessitent une attention particulière. Nous proposons des services spécialisés pour différents types de nettoyage.`
- Intertitre `Nos services spécialisés peuvent inclure` (liste) : Nettoyage de canapés et fauteuils · Nettoyage de tapis et carpettes · Nettoyage de matelas · Nettoyage intérieur de véhicules · Nettoyage de surfaces particulièrement sales · Nettoyage après une longue période d'inoccupation
- Encadré : `Vous avez un besoin particulier ? Décrivez-nous votre situation et nous vous indiquerons la meilleure solution.`
- Précision : `Les résultats dépendent du type de matériau et de l'état de la surface. Nous évaluons chaque situation avant d'intervenir.`
- Bande finale + bouton.

### 7.6 Entretien régulier à tarif forfaitaire (`/services/entretien-regulier/`)

- Titre principal : `Entretien régulier à tarif forfaitaire`
- Introduction : `Vous souhaitez maintenir votre maison ou votre entreprise propre sans avoir à vous soucier de réserver un service à chaque fois ? Notre service d'entretien régulier vous permet de bénéficier d'un nettoyage selon une fréquence adaptée à vos besoins.`
- Intertitre `Fréquences possibles` (liste) : Chaque semaine · Toutes les deux semaines · Toutes les trois semaines · Une fois par mois · Selon vos besoins
- Intertitre `Un tarif forfaitaire adapté à votre situation` : `Après l'évaluation de vos besoins, nous pouvons vous proposer un tarif forfaitaire adapté à votre situation.`
- Étapes (3) : `Évaluation de vos besoins` → `Proposition d'un tarif forfaitaire` → `Mise en place de votre calendrier d'entretien`.
- Bande finale + bouton.

### 7.7 Zones desservies (`/zones-desservies/`)

- Titre principal : `Où offrons-nous nos services ?`
- Introduction : `Nous offrons nos services de nettoyage dans la région de Montréal et dans plusieurs secteurs environnants.`
- Intertitre `Zones desservies` : une carte par région desservie :
  - `Montréal` — `Montréal et ses différents arrondissements.`
  - `Longueuil et Rive-Sud` — `Longueuil et plusieurs secteurs de la Rive-Sud.`
  - `Lanaudière` — `Plusieurs municipalités et secteurs de la région de Lanaudière.`
- Si le propriétaire fournit une liste de villes : Intertitre `Villes desservies` + liste alphabétique (sinon, bloc absent).
- Encadré : `La disponibilité du service peut varier selon la ville, le type de service et la distance.`
- Encadré d'action : `Vous ne savez pas si nous desservons votre secteur ? Envoyez-nous votre ville ou votre code postal dans le formulaire de demande et nous vous confirmerons la disponibilité.` + bouton `Vérifier mon secteur`.

### 7.8 FAQ (`/faq/`)

Titre principal : `Questions fréquentes`. Deux groupes (Intertitre) avec accordéons `<details>` : `Pour les clients` et `Pour les candidats`.

**Pour les clients**
1. *Comment obtenir une soumission ?* — `Remplissez notre formulaire de demande de service. Plus vos informations sont précises, plus notre soumission sera juste. Notre équipe analysera votre demande et communiquera avec vous pour confirmer les détails du service.`
2. *Combien coûte un nettoyage ?* — `Le prix dépend de la superficie, de l'état des lieux, des services choisis et de la fréquence. Après évaluation de vos besoins, nous vous proposons une soumission personnalisée, avec un tarif forfaitaire pour l'entretien régulier.`
3. *Dans quels secteurs intervenez-vous ?* — `Nous desservons la région de Montréal et plusieurs secteurs environnants. La disponibilité varie selon la ville, le type de service et la distance. Indiquez votre ville ou votre code postal dans le formulaire et nous vous confirmerons.`
4. *Puis-je joindre des photos à ma demande ?* — `Oui, c'est facultatif. Jusqu'à 3 photos peuvent nous aider à mieux évaluer l'état des lieux.`
5. *Quelles fréquences proposez-vous ?* — `Une seule fois, chaque semaine, toutes les deux semaines, toutes les trois semaines, une fois par mois, ou selon vos besoins.`
6. *Qui fournit les produits et l'équipement ?* — `Précisez vos attentes dans votre demande. Nous confirmons avec vous, au moment de la soumission, ce qui est fourni.`
7. *Y a-t-il des situations que vous ne pouvez pas traiter ?* — `Certaines situations (par exemple une moisissure importante, des punaises de lit ou des risques biologiques) nécessitent des services spécialisés que nous n'offrons pas. Si vous avez un doute, décrivez votre situation et nous vous dirons honnêtement si nous pouvons vous aider.`
8. *Comment reporter ou annuler un service ?* — `Prévenez-nous le plus tôt possible. Les conditions applicables sont précisées dans votre soumission.`
9. *Mes renseignements sont-ils confidentiels ?* — `Oui. Les informations que vous nous transmettez servent uniquement à répondre à votre demande. Consultez notre politique de confidentialité (lien vers `/confidentialite/`).`

**Pour les candidats**
10. *Comment m'inscrire ?* — `Remplissez le formulaire d'inscription. Il prend environ 5 minutes.`
11. *Faut-il de l'expérience ?* — `Non. Que vous ayez déjà de l'expérience ou que vous souhaitiez apprendre et développer vos compétences, nous vous invitons à vous inscrire.`
12. *L'inscription garantit-elle un emploi ou une mission ?* — `Non. Votre candidature est évaluée selon nos besoins et les opportunités disponibles. Après votre inscription et votre sélection, un entretien permet de mieux comprendre votre expérience, vos compétences et vos objectifs.`
13. *Y a-t-il des formations ?* — `Des formations pourront être proposées, notamment dans le domaine du nettoyage domestique et de l'entretien ménager.`
14. *Quels types de travail sont possibles ?* — `Selon les besoins du moment : missions ponctuelles, temps partiel, temps plein, contrats temporaires ou opportunités à plus long terme.`

Les questions de cette page alimentent aussi les informations destinées aux moteurs de recherche (section 10.3).

### 7.9 Carrières (`/carrieres/`) et inscription (`/carrieres/inscription/`)

**Page `/carrieres/`**
- Titre principal : `Rejoignez notre équipe et construisez votre avenir professionnel`
- Introduction : `Vous êtes à la recherche d'un emploi, d'un job ponctuel, d'un revenu complémentaire ou d'une opportunité professionnelle stable ? Notre entreprise vous offre la possibilité de trouver des missions et des emplois adaptés à votre profil, à vos compétences et à vos disponibilités.`
- Intertitre `Pourquoi travailler avec nous ?` — 6 blocs :
  1. `Des horaires adaptés à votre situation` — `Que vous soyez disponible quelques heures par semaine ou que vous recherchiez un emploi à temps plein, nous cherchons à vous proposer des opportunités qui correspondent à vos disponibilités.`
  2. `Des missions ponctuelles ou plus durables` — `Selon votre situation : missions ponctuelles, travail à temps partiel, contrats temporaires ou opportunités à plus long terme.`
  3. `Des possibilités de formation` — `Nous souhaitons vous aider à développer vos compétences. Des formations pourront être proposées, notamment dans le domaine du nettoyage domestique et de l'entretien ménager, afin de vous permettre d'acquérir de nouvelles connaissances et de mieux vous préparer aux missions.`
  4. `Un accompagnement professionnel` — `Après votre inscription et votre sélection, un entretien permettra de mieux comprendre votre expérience, vos compétences et vos objectifs.`
  5. `Développez votre expérience` — `Chaque mission peut être une occasion de développer votre expérience professionnelle, d'acquérir de nouvelles compétences et de construire progressivement votre parcours.`
  6. `Des opportunités adaptées à votre profil` — `Nous prenons en compte votre secteur géographique, vos disponibilités, vos compétences et le type de travail que vous recherchez.`
- Encadré (encadré d'information) : `L'inscription ne garantit pas automatiquement l'obtention d'un emploi ou d'une mission. Les candidatures sont évaluées selon les besoins et les opportunités disponibles.`
- Bande finale : Intertitre `Vous êtes prêt(e) à commencer ?` / `Que vous ayez déjà de l'expérience ou que vous souhaitiez apprendre et développer vos compétences, nous vous invitons à vous inscrire. Créez votre profil dès aujourd'hui et faites-nous connaître vos compétences et vos disponibilités.` / bouton `Je m'inscris maintenant`.

**Page `/carrieres/inscription/`**
- Titre principal : `Inscription — candidat(e)`
- Introduction : `Ce formulaire prend environ 5 minutes. Les champs marqués d'un astérisque (*) sont obligatoires. Vos renseignements sont utilisés uniquement dans le cadre de notre processus de recrutement (voir la politique de confidentialité).`
- Formulaire : section 7.2.

### 7.10 À propos (`/a-propos/`)

- Titre principal : `À propos de unilka`
- Texte : `Chez unilka, nous croyons qu'un espace propre et bien entretenu contribue directement au confort, au bien-être et à la qualité de vie. Nous offrons des services de nettoyage professionnels adaptés aux besoins des particuliers, des entreprises et des propriétaires.`
- Intertitre `Notre objectif` : `Vous faire gagner du temps et vous offrir un environnement propre, sain et agréable.`
- Intertitre `Nos engagements` : reprendre les 4 blocs de 7.1 (« Pourquoi unilka »).
- Intertitre `Notre équipe` : `Nous travaillons avec des personnes sérieuses et compétentes. Vous souhaitez en faire partie ?` + lien `/carrieres/`.
- Ne rien ajouter sur l'histoire, les fondateurs ou l'ancienneté.

### 7.11 Contact (`/contact/`)

- Titre principal : `Nous joindre`
- Texte d'introduction : `Le moyen le plus rapide de nous joindre est de remplir notre formulaire de demande de service.` + bouton `Obtenir une soumission`.
- Téléphone, courriel, heures et adresse : chaque élément n'est affiché que s'il est fourni (téléphone et courriel sous forme de liens cliquables pour appeler ou écrire).
- Bloc `Vous cherchez un emploi ?` + bouton vers `/carrieres/`.
- Si un délai de réponse est confirmé : `Nous répondons généralement dans un délai de [délai de réponse].` (sinon, phrase omise).

### 7.12 Pages de confirmation et 404

**`/soumission/merci/`** (non référencée)
- Titre principal : `Merci, votre demande a bien été envoyée`
- Texte : `Notre équipe analysera votre demande et communiquera avec vous` `dans un délai de [délai de réponse]` (omis si aucun délai n'est confirmé) `pour confirmer les détails du service.`
- Liste `Et maintenant ?` : `Nous examinons votre demande` · `Nous vous contactons pour confirmer les détails` · `Vous recevez votre soumission personnalisée`
- Boutons : `Retour à l'accueil` · `Découvrir nos services`.

**`/carrieres/merci/`** (non référencée)
- Titre principal : `Merci, votre inscription a bien été envoyée`
- Texte : `Votre candidature sera évaluée en fonction de nos besoins et des opportunités disponibles. Si votre profil correspond, nous communiquerons avec vous pour planifier un entretien.`
- Rappel : `L'inscription ne garantit pas l'obtention d'un emploi ou d'une mission.`
- Bouton : `Retour à l'accueil`.

**`/404.html`** (non référencée)
- Titre principal : `Page introuvable`
- Texte : `La page que vous cherchez n'existe pas ou a été déplacée.` Boutons : `Retour à l'accueil` · `Obtenir une soumission`.

### 7.13 Pages légales

Le contenu est défini en section 11 (confidentialité et mentions légales).

---

## 8. Spécification des formulaires (champ par champ)

**Règles communes aux deux formulaires**
- Chaque champ a une étiquette visible. Les groupes de cases et de choix ont une légende.
- Les champs obligatoires portent un astérisque (`*`) dans leur libellé, avec la légende « * champ obligatoire » en haut du formulaire.
- Les champs conditionnels suivent la section 9.1.
- Le navigateur doit pouvoir pré-remplir les champs usuels (prénom, nom, téléphone, courriel, ville, code postal, adresse).
- Les libellés entre « » sont à reprendre tels quels. Un **★** après un libellé indique un ajout recommandé par rapport au document source ; les modifications sont expliquées dans les notes.

### 8.1 Formulaire de soumission (page `/soumission/`)

**Page `/soumission/`** : titre principal `Demander une soumission` ; introduction : `Besoin d'un nettoyage ? Obtenez une évaluation de vos besoins en quelques étapes. Remplissez notre formulaire et fournissez-nous les informations nécessaires afin que nous puissions mieux comprendre votre situation et vous proposer une solution adaptée. Toutes les informations resteront confidentielles.` Bas de formulaire : `Notre équipe analysera votre demande et communiquera avec vous pour confirmer les détails du service.`

**Étape 1 — Votre service**

| Libellé | Type | Oblig. | Options / règles |
|---|---|---|---|
| Type de service souhaité | choix unique | Oui | « Résidentiel (domicile) » · « Commercial » · « Spécialisé (canapé, tapis, matelas, véhicule…) » |
| Fréquence souhaitée | choix unique | Oui | « Une seule fois (ponctuel) » ★ · « Chaque semaine » · « Toutes les 2 semaines » · « Toutes les 3 semaines » ★ · « Une fois par mois » · « Selon mes besoins / je ne sais pas encore » |
| Date souhaitée pour le service | date | Non | Date postérieure à aujourd'hui |
| Plage horaire | liste déroulante | Non | « Matin » · « Après-midi » · « Soir » · « Flexible » |

**Étape 2 — Où se situe l'espace ?**

| Libellé | Type | Oblig. | Règles |
|---|---|---|---|
| Ville | texte | Oui | Pré-remplissable par le navigateur |
| Code postal ★ | texte | Oui | Format de code postal canadien valide (lettre-chiffre-lettre, chiffre-lettre-chiffre, espace facultatif) ; message : « Veuillez saisir un code postal valide (ex. H2X 1Y4). » ; aide : « Il nous permet de confirmer rapidement que nous desservons votre secteur. » |
| Adresse complète | texte | Non | Aide : « Facultatif à cette étape, nécessaire pour confirmer la soumission. » |

**Étape 3A — Détails résidentiels** (visible seulement si « Résidentiel » est choisi)

| Libellé | Type | Oblig. | Options / règles |
|---|---|---|---|
| Type de logement | liste déroulante | Oui | « Appartement » · « Condo » · « Maison » · « Duplex » · « Autre » |
| Précisez | texte | Oui si « Autre » | Affiché seulement si « Autre » est choisi comme type de logement |
| Nombre de chambres | liste déroulante | Non | « Studio / aucune » · 1 à 4 · « 5 ou plus ». *Note : la source listait « 1 chambre ; 2 chambres… » comme cases à cocher ; un seul choix évite les réponses contradictoires* |
| Nombre de salles de bain ★ | liste déroulante | Non | 1 · 2 · 3 · « 4 ou plus » |
| Superficie approximative ★ | liste déroulante | Non | « Moins de 600 pi² » · « 600 à 1 000 pi² » · « 1 000 à 1 500 pi² » · « 1 500 à 2 500 pi² » · « Plus de 2 500 pi² » · « Je ne sais pas » |
| Quelles pièces souhaitez-vous faire nettoyer ? | cases à cocher | Non | « Cuisine » · « Salon » · « Bureau » · « Escaliers » |
| Nettoyage général | cases à cocher | Non | « Aspirateur » · « Lavage des planchers » · « Époussetage des portes » · « Nettoyage des plinthes » · « Nettoyage de miroirs » · « Désinfection des surfaces » |
| Cuisine | cases à cocher | Non | « Nettoyage extérieur des électroménagers » · « Intérieur du frigo » · « Intérieur du four » · « Four à micro-ondes » · « Armoires » · « Comptoir et évier » |
| Salle de bain | cases à cocher | Non | « Nettoyage complet » · « Douche » · « Baignoire » · « Toilette » · « Lavabo » · « Miroirs » |
| Fenêtres | cases à cocher | Non | « Intérieures » · « Extérieures (sur évaluation) » · « Vitres et cadres » · « Portes vitrées » |
| Nombre de fenêtres | nombre | Non | Nombre entier de 0 à 200 |
| Y a-t-il des animaux à la maison ? ★ | choix unique | Non | « Non » · « Oui » |
| État actuel du logement | choix unique | Oui | « Entretien régulier » · « Besoin de nettoyage standard » · « Besoin de nettoyage en profondeur » · « Logement très sale nécessitant une intervention importante » |

**Étape 3B — Détails commerciaux** (visible seulement si « Commercial » est choisi)

| Libellé | Type | Oblig. | Options |
|---|---|---|---|
| Type de local ★ | liste déroulante | Oui | « Bureau » · « Commerce » · « Local professionnel » · « Petite entreprise » · « Espaces communs » · « Immeuble ou espaces locatifs » · « Local après travaux ou rénovation » · « Autre » |
| Superficie approximative ★ | liste déroulante | Non | mêmes options que la superficie du logement |
| Moment d'intervention souhaité ★ | choix unique | Non | « Pendant les heures d'ouverture » · « En dehors des heures d'ouverture » · « Peu importe / à discuter » |
| État actuel du local ★ | choix unique | Oui | mêmes niveaux que l'état du logement (libellés : « Entretien régulier » · « Nettoyage standard » · « Nettoyage en profondeur » · « Local très sale nécessitant une intervention importante ») |

**Étape 3C — Détails spécialisés** (visible seulement si « Spécialisé » est choisi)

| Libellé | Type | Oblig. | Options |
|---|---|---|---|
| Que souhaitez-vous faire nettoyer ? | cases à cocher | Oui (au moins 1) | « Canapés et fauteuils » · « Tapis et carpettes » · « Matelas » · « Intérieur de véhicule » · « Surface particulièrement sale » · « Lieu inoccupé depuis longtemps » |
| Combien d'éléments ? Dimensions, tailles ou type de véhicule ★ | texte | Non | 200 caractères maximum |

**Étape 3D — Description et photos** (toujours visible)

| Libellé | Type | Oblig. | Règles |
|---|---|---|---|
| Description des besoins | texte long | Oui pour un service spécialisé, sinon Non | 1 500 caractères maximum, avec compteur. Aide : « Décrivez-nous brièvement ce que vous souhaitez faire nettoyer. Vous pouvez préciser les pièces concernées, les surfaces à nettoyer ou toute situation particulière dont nous devrions être informés. » |
| Photos (facultatif) | photos (plusieurs) | Non | Formats JPEG, PNG, WebP ; 3 photos au maximum ; réduction automatique avant envoi (section 9.2) |
| Autre commentaire à ajouter ? | texte long | Non | 1 000 caractères maximum |

**Étape 4 — Vos coordonnées**

| Libellé | Type | Oblig. | Règles |
|---|---|---|---|
| Prénom | texte | Oui | Pré-remplissable par le navigateur |
| Nom | texte | Non | |
| Numéro de téléphone | téléphone | Voir règle ci-dessous | Numéro de 10 chiffres, avec espaces, tirets ou parenthèses acceptés |
| Adresse courriel | courriel | Voir règle ci-dessous | |
| Règle de contact | — | — | **Au moins un** des deux champs « Numéro de téléphone » ou « Adresse courriel » est obligatoire. Message : « Veuillez indiquer un numéro de téléphone ou une adresse courriel. » |
| Comment préférez-vous être joint(e) ? ★ | choix unique | Non | Téléphone · Courriel · « Peu importe » |
| « J'accepte que unilka utilise ces renseignements pour répondre à ma demande, conformément à la politique de confidentialité. » (lien vers `/confidentialite/`, s'ouvre dans le même onglet) ★ | case à cocher | Oui | — |

**Champ de la source retiré** : « Souhaitez-vous recevoir une soumission personnalisée ? » — redondant, tout le formulaire sert à cela (noté D20 dans `DECISIONS.md`).

**Bouton d'envoi** : `Envoyer ma demande`. Texte sous le bouton : `Notre équipe analysera votre demande et communiquera avec vous pour confirmer les détails du service.`

### 8.2 Formulaire de candidature (page `/carrieres/inscription/`)

**Section 1 — Informations personnelles**

| Libellé | Type | Oblig. | Options / règles |
|---|---|---|---|
| Prénom | texte | Oui | |
| Nom | texte | Oui | |
| « J'ai 18 ans ou plus » | case à cocher | Oui | Remplace la date de naissance |
| Numéro de téléphone | téléphone | Oui | |
| Adresse courriel | courriel | Oui | |
| Ville | texte | Oui | |
| Adresse | texte | Non | Aide : « Facultatif. Nous avons surtout besoin de votre ville pour évaluer les déplacements. » |
| Langue(s) parlée(s) | cases à cocher | Oui (≥ 1) | « Français » · « Anglais » · « Autre » |
| Précisez | texte | Oui si « Autre » | |
| Langue préférée pour les communications | liste déroulante | Oui | Français · Anglais · Autre |

**Section 2 — Autorisation de travail**

| Libellé | Type | Oblig. | Options |
|---|---|---|---|
| Êtes-vous légalement autorisé(e) à travailler au Canada ? | choix unique | Oui | « Oui » · « Non » · « Je dois vérifier ma situation » |

*Notes : le champ « Votre situation au Canada » de la source est supprimé (doublon, collecte inutile). Aucun autre renseignement sur le statut d'immigration ne doit être demandé.*

**Section 3 — Situation et type de travail**

| Libellé | Type | Oblig. | Options |
|---|---|---|---|
| Quelle est votre situation actuelle ? | choix unique | Oui | « À la recherche d'un emploi » · « En emploi et je cherche un emploi complémentaire » · « Étudiant(e) » · « Travailleur(se) autonome » · « Autre » |
| Précisez | texte | Oui si « Autre » | |
| Type de travail recherché | cases à cocher | Oui (≥ 1) | « Job ponctuel » · « Travail à temps partiel » · « Travail à temps plein » · « Emploi permanent » · « Contrat temporaire » · « Je suis ouvert(e) à plusieurs possibilités » |

**Section 4 — Expérience et compétences**

| Libellé | Type | Oblig. | Options / règles |
|---|---|---|---|
| Avez-vous déjà travaillé dans ce domaine ? | choix unique | Oui | Oui · Non |
| Nombre d'années d'expérience | liste déroulante | Si Oui | « Moins d'un an » · « 1 à 2 ans » · « 3 à 5 ans » · « Plus de 5 ans » |
| Type d'expérience | texte | Non | |
| Principales tâches réalisées | texte long | Non | 800 caractères maximum |
| Dernier employeur, si applicable | texte | Non | |
| Références professionnelles disponibles | choix unique | Non | Oui · Non |
| Quelles sont vos principales compétences ? | texte long | Non | 800 caractères maximum |

Les champs « Nombre d'années d'expérience » à « Références professionnelles disponibles » sont affichés seulement si la réponse à « Avez-vous déjà travaillé dans ce domaine ? » est Oui. « Quelles sont vos principales compétences ? » est toujours visible.

**Section 5 — Disponibilités**

| Libellé | Type | Oblig. | Options / règles |
|---|---|---|---|
| Jours disponibles | cases à cocher | Oui (≥ 1) | Lundi à dimanche (une case par jour) |
| Disponibilité | cases à cocher | Oui (≥ 1) | Matin · Après-midi · Soir · Flexible |
| Nombre d'heures souhaitées par semaine | nombre | Non | Nombre entier de 1 à 60 |
| Date à laquelle vous pouvez commencer | date | Non | |

**Section 6 — Mobilité**

| Libellé | Type | Oblig. | Options / règles |
|---|---|---|---|
| Dans quelle zone êtes-vous prêt(e) à travailler ? | cases à cocher | Oui (≥ 1) | Une case par région de `zones.regions` + « Autre secteur » |
| Secteur ou ville précis (facultatif) | texte | Non | |
| Êtes-vous en mesure de vous déplacer pour effectuer une mission ? | choix unique | Oui | Oui · Non · « Selon la distance » |
| Moyen de transport | cases à cocher | Non | « Transport en commun » · « Voiture » · « Vélo » · « Autre » |
| Précisez | texte | Si « Autre » | |

**Section 7 — Formation**

| Libellé | Type | Oblig. | Options |
|---|---|---|---|
| Souhaitez-vous suivre une formation pour développer vos compétences ? | choix unique | Oui | Oui · Non · « Peut-être » |
| Formations qui vous intéressent | cases à cocher | Non | « Nettoyage domestique » · « Techniques d'entretien » · « Utilisation sécuritaire des produits d'entretien » · « Organisation du travail » · « Relation avec les clients » · « Santé et sécurité au travail » · « Autre » |
| Précisez | texte | Si « Autre » | |

« Formations qui vous intéressent » est affiché seulement si la réponse à « Souhaitez-vous suivre une formation… » n'est pas Non.

**Section 8 — Confirmation**

Texte : `Je confirme que les renseignements fournis dans ce formulaire sont exacts. Je comprends que l'inscription ne garantit pas automatiquement l'obtention d'un emploi ou d'une mission. Ma candidature pourra être évaluée en fonction des besoins et des opportunités disponibles.`

| Libellé | Type | Oblig. |
|---|---|---|
| « Je confirme l'exactitude de ces renseignements et je comprends que l'inscription ne garantit pas l'obtention d'un emploi ou d'une mission. » | case à cocher | Oui |
| « J'accepte d'être contacté(e) concernant des opportunités correspondant à mon profil. » | case à cocher | Oui |
| « J'accepte que mes informations soient utilisées dans le cadre du processus de recrutement, conformément à la politique de confidentialité. » (lien) | case à cocher | Oui |

**Remplacements par rapport à la source** : la signature (nom et date) est supprimée au profit des cases de consentement (la date est enregistrée automatiquement par l'hébergeur). **Bouton d'envoi** : `Envoyer mon inscription`.

---

## 9. Comportement des formulaires

### 9.1 Affichage conditionnel
- Seuls les champs pertinents sont visibles. Un champ masqué n'est **ni obligatoire, ni envoyé** avec la demande.
- Formulaire de soumission : le choix « Type de service » fait apparaître **un seul** des blocs 3A (résidentiel), 3B (commercial) ou 3C (spécialisé). Choisir « Autre » pour le type de logement fait apparaître « Précisez ».
- Formulaire de candidature : les détails d'expérience n'apparaissent que si « déjà travaillé dans ce domaine » = Oui ; la liste des formations n'apparaît que si la réponse à « Souhaitez-vous suivre une formation » n'est pas Non ; chaque champ « Précisez » n'apparaît que pour la réponse « Autre » correspondante.
- Si l'affichage dynamique est indisponible, tous les blocs restent visibles, chacun précédé d'un intertitre qui indique son contexte (ex. « Si vous choisissez un service résidentiel »).

### 9.2 Photos (formulaire de soumission)
1. Maximum **3 photos**. Au-delà : « Vous pouvez joindre jusqu'à 3 photos. »
2. Formats acceptés : JPEG, PNG, WebP. Autre format non lisible : « Ce format n'est pas pris en charge. Veuillez utiliser une photo JPEG ou PNG. »
3. Chaque photo est **réduite automatiquement** avant l'envoi (côté le plus long d'environ 1 600 px, qualité réglée pour garder un poids raisonnable). Le poids total d'une demande vise **6 Mo ou moins** pour que l'envoi n'échoue jamais ; si besoin, réduire davantage.
4. Le visiteur voit une miniature de chaque photo avec son nom, sa taille et un bouton « Retirer ».
5. Les photos servent uniquement à évaluer la demande et ne sont envoyées nulle part ailleurs.

### 9.3 Validation et messages d'erreur

| Cas | Message |
|---|---|
| Champ obligatoire vide | « Ce champ est obligatoire. » |
| Groupe de cases sans sélection | « Veuillez choisir au moins une option. » |
| Courriel invalide | « Veuillez saisir une adresse courriel valide. » |
| Téléphone invalide | « Veuillez saisir un numéro de téléphone valide (ex. 514 555 0123). » |
| Code postal invalide | « Veuillez saisir un code postal valide (ex. H2X 1Y4). » |
| Ni téléphone ni courriel | « Veuillez indiquer un numéro de téléphone ou une adresse courriel. » |
| Consentement non coché | « Vous devez accepter pour envoyer le formulaire. » |
| Trop de photos | « Vous pouvez joindre jusqu'à 3 photos. » |

Comportement : le formulaire est vérifié à l'envoi, puis champ par champ quand le visiteur le quitte. À l'envoi refusé, un **résumé des erreurs** (titre « Veuillez corriger les éléments suivants ») apparaît en haut du formulaire avec un lien vers chaque champ à corriger, et le curseur se place sur ce résumé. Chaque champ fautif est signalé par un message placé juste en dessous, annoncé aux lecteurs d'écran. L'erreur n'est jamais indiquée par la couleur seule.

### 9.4 Envoi, confirmation et protection
- À l'envoi valide, le bouton se verrouille et affiche « Envoi en cours… » (pas de double envoi), puis le visiteur arrive sur la **page de confirmation** correspondante.
- Le propriétaire reçoit **un courriel contenant toutes les réponses** (et les photos ou un lien pour les consulter). Les demandes restent consultables ailleurs que dans la boîte courriel (au moins pendant la durée de conservation de D22).
- **Protection contre les envois automatiques** (robots) invisible pour les vrais visiteurs, sans outil de vérification qui exigerait du suivi ou des services tiers.
- Aucune donnée personnelle n'est gardée dans le navigateur du visiteur après l'envoi.
- Le propriétaire doit pouvoir vérifier que les notifications arrivent bien (étape de test dans le guide).

---

## 10. Référencement local (SEO)

### 10.1 Titres et descriptions de chaque page

Le séparateur de titre est le tiret long « — » (jamais la barre verticale). Titres : 60 caractères maximum. Descriptions : 155 caractères maximum.

| Page | Titre | Description | Index |
|---|---|---|---|
| `/` | `unilka — Nettoyage professionnel à Montréal et environs` | `Nettoyage résidentiel, commercial et spécialisé à Montréal et environs. Entretien régulier à tarif forfaitaire. Demandez une soumission en ligne.` | oui |
| `/services/` | `Services de nettoyage à Montréal — unilka` | `Résidentiel, commercial, spécialisé et entretien régulier : découvrez les services de nettoyage unilka à Montréal et environs.` | oui |
| `/services/nettoyage-residentiel/` | `Nettoyage résidentiel à Montréal — unilka` | `Ménage de maison, condo ou appartement, grand ménage et nettoyage avant ou après déménagement à Montréal et environs. Demandez une soumission.` | oui |
| `/services/nettoyage-commercial/` | `Nettoyage commercial à Montréal — unilka` | `Entretien de bureaux, commerces et locaux professionnels, y compris après travaux ou rénovation. Soumission personnalisée à Montréal et environs.` | oui |
| `/services/nettoyage-specialise/` | `Nettoyage de canapés, tapis et matelas — unilka` | `Nettoyage de canapés, tapis, matelas et intérieur de véhicules à Montréal et environs. Décrivez votre besoin, nous vous proposons une solution.` | oui |
| `/services/entretien-regulier/` | `Entretien ménager régulier à tarif forfaitaire — unilka` | `Entretien régulier de votre maison ou entreprise : chaque semaine, aux 2 ou 3 semaines, ou chaque mois. Tarif forfaitaire après évaluation.` | oui |
| `/soumission/` | `Demande de soumission de nettoyage — unilka` | `Remplissez notre formulaire pour obtenir une soumission personnalisée de nettoyage résidentiel, commercial ou spécialisé à Montréal et environs.` | oui |
| `/soumission/merci/` | `Demande envoyée — unilka` | `Votre demande de soumission a bien été envoyée.` | **non** |
| `/zones-desservies/` | `Zones desservies : Montréal, Rive-Sud, Lanaudière — unilka` | `unilka offre ses services de nettoyage à Montréal, Longueuil et la Rive-Sud, ainsi que dans Lanaudière. Vérifiez la disponibilité dans votre secteur.` | oui |
| `/carrieres/` | `Emplois en nettoyage à Montréal — unilka` | `Rejoignez l'équipe unilka : missions ponctuelles, temps partiel ou temps plein, avec possibilités de formation. Inscrivez-vous en ligne.` | oui |
| `/carrieres/inscription/` | `Inscription candidat — unilka` | `Créez votre profil : compétences, disponibilités et secteur. Formulaire d'inscription pour travailler avec unilka.` | oui |
| `/carrieres/merci/` | `Inscription envoyée — unilka` | `Votre inscription a bien été envoyée.` | **non** |
| `/a-propos/` | `À propos de unilka — Nettoyage professionnel` | `Découvrez notre approche : un service professionnel, prompt et personnalisé pour des espaces propres, sains et agréables.` | oui |
| `/faq/` | `Questions fréquentes — unilka` | `Réponses aux questions sur nos services, les soumissions, les zones desservies et les inscriptions des candidats.` | oui |
| `/contact/` | `Nous joindre — unilka` | `Contactez unilka ou demandez directement une soumission de nettoyage à Montréal et environs.` | oui |
| `/confidentialite/` | `Politique de confidentialité — unilka` | `Comment unilka recueille, utilise et protège vos renseignements personnels.` | oui |
| `/mentions-legales/` | `Mentions légales — unilka` | `Mentions légales et conditions d'utilisation du site unilka.` | oui |
| `/404.html` | `Page introuvable — unilka` | `La page demandée est introuvable.` | **non** |

### 10.2 Règles éditoriales
- Intégrer naturellement : « nettoyage », « ménage », « Montréal », « Longueuil », « Lanaudière », « entretien régulier », « nettoyage commercial », « grand ménage », « après déménagement ». Pas de bourrage de mots-clés.
- Un seul titre principal par page, intertitres sans saut de niveau.
- Liens internes descriptifs (jamais « cliquez ici »).
- Texte alternatif pour toute image informative.

### 10.3 Indexation et informations destinées aux moteurs de recherche
- Les pages de confirmation (soumission et inscription) et la page « introuvable » **ne doivent pas être référencées** par les moteurs de recherche.
- Fournir aux moteurs un plan du site qui liste toutes les autres pages, et une indication des pages à explorer.
- Intégrer les informations standard sur l'entreprise (nom, slogan, description, zone desservie, et coordonnées **seulement si fournies**), sur chaque service, sur le fil d'Ariane et sur la FAQ.
- **Ne jamais publier de note ni d'avis** : aucun avis réel n'a été fourni.
- Chaque page doit avoir une adresse « officielle » unique, basée sur l'adresse du site (5.3).

---

## 11. Conformité légale (à faire valider par un juriste avant la mise en ligne)

*L'agent rédige les textes ci-dessous comme base de travail. Il ne s'agit pas d'un avis juridique ; `TODO-OWNER.md` doit demander une validation.*

### 11.1 Principes
1. **Langue** : le site est en français (exigence de la Charte de la langue française pour les entreprises du Québec). Une version anglaise éventuelle ne doit pas être moins accessible.
2. **Protection des renseignements personnels (Loi 25)** : le site collecte des renseignements personnels (coordonnées, photos de logements, renseignements de candidature). Il faut donc une politique de confidentialité publiée, un consentement clair à la collecte, une personne responsable désignée, la collecte du strict nécessaire (D10) et l'information sur l'hébergement hors Québec le cas échéant.
3. **Aucun témoin de navigation ni traceur** (D08) : aucun bandeau de consentement ; la politique le précise.

### 11.2 Politique de confidentialité (`/confidentialite/`)

Titre : `Politique de confidentialité`. Afficher la date de dernière mise à jour. Sections :

1. **Qui sommes-nous** : unilka (nom légal si fourni) ; personne responsable de la protection des renseignements personnels (nom et courriel fournis par le propriétaire ; à défaut : « la personne responsable de la protection des renseignements personnels de unilka », avec lien vers la page Contact).
2. **Renseignements que nous recueillons** :
   - *Demande de soumission* : prénom, nom, téléphone, courriel, ville, code postal, adresse (facultative), détails du service demandé, photos (facultatives), commentaires.
   - *Inscription de candidat* : prénom, nom, téléphone, courriel, ville, adresse (facultative), langues, autorisation de travailler au Canada (oui, non ou à vérifier), situation actuelle, expérience, compétences, disponibilités, mobilité, intérêts de formation. Nous ne demandons ni date de naissance, ni numéro d'assurance sociale, ni pièce d'identité.
   - *Données techniques* : l'hébergeur peut enregistrer des journaux techniques (adresse IP, date, page consultée) à des fins de sécurité et de bon fonctionnement.
3. **Pourquoi nous les recueillons** : répondre aux demandes de soumission, fournir et organiser les services ; évaluer les candidatures et contacter les candidats pour des opportunités correspondant à leur profil.
4. **Votre consentement** : donné par la case à cocher du formulaire ; il peut être retiré à tout moment.
5. **Avec qui nous les partageons** : uniquement avec les fournisseurs nécessaires au fonctionnement du site (hébergement et traitement des formulaires, dont les serveurs peuvent se trouver hors du Québec et du Canada). **Nommer ces fournisseurs une fois le choix de l'agent arrêté.** Nous ne vendons pas les renseignements.
6. **Durée de conservation** : selon D22, puis destruction ou anonymisation.
7. **Sécurité** : connexion sécurisée ; accès limité aux personnes qui en ont besoin.
8. **Vos droits** : accès, rectification, retrait du consentement, suppression, dans les limites prévues par la loi ; comment les exercer ; droit de porter plainte à la Commission d'accès à l'information du Québec.
9. **Personnes mineures** : le formulaire de candidature s'adresse aux personnes de 18 ans et plus.
10. **Témoins et traceurs** : « Ce site n'utilise aucun témoin de navigation ni outil de suivi publicitaire. »
11. **Modifications** : publiées sur cette page.

### 11.3 Mentions légales (`/mentions-legales/`)

Sections : **Éditeur du site** (nom légal ou commercial, NEQ et coordonnées si fournis) · **Hébergement** (nom de l'hébergeur retenu) · **Propriété intellectuelle** (textes, logo et éléments graphiques protégés ; reproduction interdite sans autorisation) · **Nature des informations** (informations générales ; une soumission ne devient contractuelle qu'après acceptation écrite par les deux parties) · **Limitation de responsabilité** (contenu fourni avec soin, sans garantie d'absence d'erreur) · **Liens externes** (aucune responsabilité pour les sites tiers) · **Droit applicable** (lois du Québec et du Canada ; tribunaux du Québec compétents).

---

## 12. Accessibilité et performance

### 12.1 Accessibilité (niveau WCAG 2.1 AA)
1. Structure claire : en-tête, navigation, contenu principal, pied de page, intertitres logiques.
2. Lien d'évitement en première position.
3. Contrastes conformes (section 6.3).
4. Navigation complète au clavier, ordre logique, focus toujours visible.
5. Zones cliquables d'au moins 44 × 44 px (boutons, cases, choix, liens du menu).
6. Formulaires : étiquettes visibles, groupes légendés, erreurs annoncées, champs usuels pré-remplissables par le navigateur.
7. Images informatives avec texte alternatif ; images décoratives ignorées par les lecteurs d'écran.
8. Menu du téléphone annoncé correctement (ouvert ou fermé).
9. Animations réduites pour les personnes qui le demandent.
10. Texte agrandissable jusqu'à 200 % sans perte de contenu ; aucun défilement horizontal à 320 px de largeur.
11. Langue de la page déclarée comme français canadien.
12. Les liens qui ouvrent un fichier ou un autre site l'indiquent dans leur texte.

### 12.2 Performance

| Mesure | Cible |
|---|---|
| Poids de chaque page (hors images) | moins de 150 Ko |
| Illustrations et icônes | légères (moins de 8 Ko chacune) |
| Chargement sur téléphone, connexion moyenne | page utilisable en moins de 3 secondes |
| Notes d'un audit de qualité de page (si l'agent peut en réaliser un) | 95 ou plus en performance, accessibilité, bonnes pratiques et référencement |
| Ressources chargées depuis d'autres sites | aucune |

---

## 13. Feuille de route de réalisation

**Fonctionnement** : exécuter les phases dans l'ordre. Chaque tâche indique l'action, le livrable et le critère d'acceptation (CA). Après chaque tâche, consigner une ligne dans `PROGRESS.md`. Ne passer à la phase suivante que si tous les CA de la phase sont validés.

### Phase 0 — Préparation

| Tâche | Action | CA |
|---|---|---|
| T-0.1 | Lire tout le document ; créer `DECISIONS.md` en recopiant D01 à D22 | 22 décisions listées avec le statut « appliquée par défaut » |
| T-0.2 | Choisir la solution technique en respectant la section 0.2 et la décrire en quelques lignes dans `DECISIONS.md` | Choix justifié ; chaque exigence de 0.2 est couverte |
| T-0.3 | Mettre en place l'endroit unique où se trouvent les informations modifiables de la section 5.3, avec leurs valeurs par défaut | Changer une valeur la met à jour partout ; une valeur vide fait disparaître proprement le bloc concerné |
| T-0.4 | Créer `PROGRESS.md` et `TODO-OWNER.md` | Fichiers présents |

### Phase 1 — Identité visuelle et squelette commun

| Tâche | Action | CA |
|---|---|---|
| T-1.1 | Créer le logotype provisoire, appliquer couleurs et typographie (section 6) | Tous les contrastes de 6.3 vérifiés et consignés |
| T-1.2 | Construire les éléments communs : en-tête, navigation et sous-menu Services, lien d'évitement, pied de page à 4 colonnes, fil d'Ariane, bande d'appel à l'action | Le menu contient tous les liens de 5.1 ; le bouton « Obtenir une soumission » est visible partout, y compris sur téléphone |
| T-1.3 | Créer les 6 illustrations et les icônes (6.6) | Chaque illustration est légère et cohérente avec la charte |

### Phase 2 — Pages de contenu

| Tâche | Action | CA |
|---|---|---|
| T-2.1 | Accueil (7.1) | Tous les blocs présents ; le bloc de confiance est **absent** quand rien n'est confirmé |
| T-2.2 | Services : vue d'ensemble et 4 pages de détail (7.2 à 7.6) | Textes identiques à la section 7 ; fil d'Ariane et bande d'appel à l'action présents |
| T-2.3 | Zones desservies (7.7) | Les trois régions sont affichées ; le bloc des villes est absent quand la liste est vide |
| T-2.4 | FAQ (7.8) | 14 questions en 2 groupes |
| T-2.5 | Carrières (7.9) | 6 blocs, encadré d'avertissement, bouton vers l'inscription |
| T-2.6 | À propos et Contact (7.10 et 7.11) | Contact : aucune coordonnée affichée quand elle n'est pas fournie, aucun libellé orphelin |
| T-2.7 | Pages de confirmation et page introuvable (7.12) | Non référencées par les moteurs |
| T-2.8 | Pages légales (section 11) | Toutes les sections de 11.2 et 11.3 présentes |

### Phase 3 — Formulaires

| Tâche | Action | CA |
|---|---|---|
| T-3.1 | Formulaire de soumission (8.1) | Tous les champs, options et libellés de 8.1 sont présents et conformes |
| T-3.2 | Formulaire de candidature (8.2) | Tous les champs de 8.2 sont présents et conformes |
| T-3.3 | Affichage conditionnel (9.1) | Changer le type de service affiche le bon bloc et masque les autres ; un champ masqué n'est pas obligatoire ni envoyé |
| T-3.4 | Validation et messages (9.3) | Envoyer un formulaire vide affiche le résumé d'erreurs avec le curseur dessus ; les 8 messages sont obtenus |
| T-3.5 | Photos (9.2) | Une photo de 5 Mo est réduite ; 4 photos sélectionnées produisent le message d'erreur |
| T-3.6 | Envoi, confirmation, notification (9.4) | Un envoi de test mène à la page de confirmation et déclenche la notification (ou procédure de test documentée) |
| T-3.7 | Test avec l'affichage dynamique désactivé | Les deux formulaires restent complets et envoyables |

### Phase 4 — Référencement et conformité

| Tâche | Action | CA |
|---|---|---|
| T-4.1 | Appliquer titres et descriptions (10.1) | Toutes les longueurs respectent les limites |
| T-4.2 | Indexation et informations pour les moteurs (10.3) | Les 3 pages non référencées sont exclues du plan du site ; aucune note ni avis publié |
| T-4.3 | Relecture des pages légales (section 11) | Aucune mention de suivi ou de témoins inexacte ; fournisseurs nommés |

### Phase 5 — Contrôle qualité

| Tâche | Action | CA |
|---|---|---|
| T-5.1 | Exécuter les contrôles de conformité (14.1) | Zéro écart restant |
| T-5.2 | Exécuter les 11 scénarios de test des formulaires (14.2) | Tous réussis |
| T-5.3 | Effectuer les 5 contrôles manuels (14.3) | Consignés dans `QA-REPORT.md` |
| T-5.4 | Relire tous les textes (orthographe, typographie, ton, cohérence) | Aucune occurrence de « UNILKA », « unilka service », « personnel qualifié », « gratuit » ou « gratuite » |

### Phase 6 — Livraison

| Tâche | Action | CA |
|---|---|---|
| T-6.1 | Rédiger le guide d'utilisation (16.2) | Une personne non technique peut suivre chaque étape |
| T-6.2 | Compléter `TODO-OWNER.md` (section 15) | Chaque information manquante de 5.3 y figure |
| T-6.3 | Produire l'archive finale | L'archive s'ouvre et contient tous les livrables de 0.1 |
| T-6.4 | Rédiger un résumé final de 10 lignes maximum : ce qui est livré, ce qui reste à faire par le propriétaire | Mentionne les 5 éléments les plus urgents de `TODO-OWNER.md` |

---

## 14. Plan de test et de recette

### 14.1 Contrôles de conformité (tous obligatoires)

1. Les 18 pages de la section 5 existent et s'affichent sans erreur.
2. Chaque page a un titre unique (60 caractères maximum), une description unique (155 maximum), un seul titre principal et des intertitres sans saut de niveau.
3. Tous les liens internes mènent à une page existante ; aucun lien vide.
4. Toute image informative a un texte alternatif.
5. Chaque champ de formulaire a une étiquette visible ; tous les champs des sections 8.1 et 8.2 existent.
6. Aucun texte provisoire visible (« à compléter », « TODO », « lorem », texte entre crochets non résolu).
7. Aucun cookie, aucun outil de suivi, aucun contenu chargé depuis un autre site hors nécessité des formulaires.
8. Les pages de confirmation et la page introuvable ne sont pas référencées par les moteurs.
9. Cohérence de marque : aucune occurrence de « UNILKA », « unilka service », « personnel qualifié », « gratuit » ou « gratuite » ; chaque page contient « unilka ».
10. Poids et rapidité des pages conformes à 12.2.
11. Les blocs conditionnels (confiance, villes, coordonnées, délai de réponse, réseaux sociaux) sont **absents** quand l'information n'est pas fournie.
12. Les informations destinées aux moteurs de recherche sont valides et ne contiennent ni note ni avis.
13. Les exigences d'accessibilité de 12.1 sont vérifiées.
14. La politique de confidentialité et les mentions légales contiennent toutes les sections de 11.2 et 11.3.

### 14.2 Scénarios de test des formulaires

| # | Scénario | Résultat attendu |
|---|---|---|
| F1 | Envoyer le formulaire de soumission vide | Résumé d'erreurs ; curseur sur le résumé ; champs fautifs marqués |
| F2 | Choisir « Résidentiel » | Le bloc 3A apparaît, 3B et 3C restent masqués et ne comptent pas |
| F3 | Choisir « Commercial » puis « Spécialisé » | Les blocs correspondants s'affichent tour à tour |
| F4 | Remplir tout sauf téléphone et courriel | Message « Veuillez indiquer un numéro de téléphone ou une adresse courriel. » |
| F5 | Code postal « 12345 » | Message de code postal invalide |
| F6 | Joindre 4 photos | Message « Vous pouvez joindre jusqu'à 3 photos. » |
| F7 | Soumission complète et valide | Arrivée sur la page de confirmation et notification reçue |
| F8 | Candidature : répondre « Non » à « Avez-vous déjà travaillé dans ce domaine ? » | Les détails d'expérience sont masqués et ne comptent pas |
| F9 | Candidature : « Formation souhaitée » = Non | La liste des formations est masquée |
| F10 | Candidature complète sans cocher les consentements | Messages « Vous devez accepter pour envoyer le formulaire. » |
| F11 | Désactiver l'affichage dynamique | Les deux formulaires restent complets et envoyables |

### 14.3 Contrôles manuels à consigner dans `QA-REPORT.md`

1. **Lecture à 320 px, 768 px et 1280 px de largeur** : aucun débordement horizontal, menu utilisable.
2. **Navigation au clavier** d'une page de service et d'un formulaire, du début à la fin.
3. **Lecture critique des textes** : orthographe, typographie, ton, cohérence avec la section 7.
4. **Parcours client complet** : Accueil → Service → Soumission → Confirmation.
5. **Parcours candidat complet** : Accueil → Carrières → Inscription → Confirmation.

Pour chaque contrôle : date, résultat (réussi ou échec) et correctif appliqué.

---

## 15. Ce que l'agent ne peut pas faire (à lister dans `TODO-OWNER.md`)

Pour chaque élément : **quoi**, **pourquoi**, et **où cela s'applique** dans le site.

### Priorité 1 — Avant la mise en ligne

| Élément | Pourquoi |
|---|---|
| Nom légal et NEQ | Mentions légales |
| Courriel et téléphone d'affaires | Contact et crédibilité |
| **Courriel de réception des formulaires** et activation des notifications chez l'hébergeur | Sans lui, personne n'est averti des demandes |
| Nom et courriel du responsable de la protection des renseignements personnels | Exigence de la Loi 25 |
| Confirmation des régions desservies et, si souhaité, liste de villes | Éviter de promettre un secteur non desservi |
| Nom de domaine et configuration chez l'hébergeur | Adresse officielle du site, plan du site |
| Validation juridique des pages légales | Responsabilité |

### Priorité 2 — Pour rassurer les clients

| Élément | Pourquoi |
|---|---|
| Assurance responsabilité (oui/non) | Affiche le bloc de confiance |
| Cautionnement du personnel (oui/non) | Idem |
| Vérification des antécédents (oui/non) | Idem |
| Produits écologiques (oui/non) | Idem |
| Programme de formation interne (oui/non) | Idem |
| Délai de réponse réel, politique d'annulation, qui fournit produits et équipement | Précision des promesses (FAQ 7.8, questions 6 et 8) |
| Confirmation des exclusions de service | FAQ 7.8, question 7 (D13) |
| Statut des travailleurs (employés ou autonomes) et validation juridique de la page Carrières | Risque de mauvaise classification |
| Confirmation des durées de conservation (D22) | Politique de confidentialité |

### Priorité 3 — Pour la croissance

| Élément | Pourquoi |
|---|---|
| Logo définitif, vraies photos d'équipe ou de réalisations (avec consentement) | Remplacer le logotype provisoire (D11) |
| Fiche **Google Business Profile** (entreprise à zone de service), nom, téléphone et site cohérents | Visibilité locale |
| Avis clients réels | Preuve sociale (à ajouter ensuite, jamais fictifs) |
| Compte chez l'hébergeur, mise en ligne, vérification des limites du service gratuit (nombre de demandes par mois, taille des envois) | Éviter de perdre des demandes |
| Version anglaise éventuelle | Élargir l'audience |
| Mesure d'audience sans cookie, si des statistiques de visite sont souhaitées | Suivi de l'activité |

---

## 16. Livrables, guide d'utilisation et interdits

### 16.1 Livrables
Site complet · guide d'utilisation · `DECISIONS.md` · `TODO-OWNER.md` · `QA-REPORT.md` · `PROGRESS.md` · archive unique.

### 16.2 Contenu du guide d'utilisation (pour un non-technicien)
1. Présentation en une phrase du site et de sa structure.
2. Comment modifier un texte d'une page.
3. Comment modifier une coordonnée, une région desservie ou un élément de confiance (5.3).
4. Comment ajouter une ville desservie.
5. Comment mettre le site en ligne, étape par étape, avec captures d'écran décrites en mots.
6. Comment activer et **tester** les notifications de formulaires.
7. Comment retrouver les demandes et candidatures reçues, et comment les supprimer à la fin de leur durée de conservation.
8. Comment remplacer le logo.
9. Que faire si un formulaire ne marche plus ou si une page ne s'affiche pas.

### 16.3 À ne jamais faire
- Inventer une coordonnée, une assurance, un prix, un avis, une certification ou une ville desservie.
- Charger une ressource ou un service de suivi extérieur au site, ou poser un cookie.
- Demander une date de naissance, un statut d'immigration détaillé, un numéro d'assurance sociale ou une pièce d'identité.
- Écrire « gratuit » ou « gratuite » (non confirmé par la source).
- Écrire « UNILKA » ou « unilka service ».
- Laisser un champ masqué obligatoire ou envoyé.
- Livrer sans avoir exécuté tous les contrôles de la section 14.

---

*Fin du document. Si deux sections semblent se contredire, appliquer dans l'ordre : section 0 (règles impératives), section 2 (décisions), section 7 (contenu), section 8 (formulaires), puis les autres.*
