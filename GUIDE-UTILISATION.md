# Guide d'utilisation et de gestion — unilka

Bienvenue dans le guide de gestion de votre site web **unilka** !  
Ce document a été conçu pour vous permettre de modifier facilement les informations de votre entreprise, de gérer vos contenus et de déployer votre site en toute sérénité, sans nécessiter de compétences avancées en programmation.

---

## 1. Comment modifier les coordonnées de votre entreprise ?

Toutes les coordonnées et informations officielles de l'entreprise sont centralisées dans **un seul fichier** :  
📁 `src/data/site-config.json`

### 💡 Règle importante :
Tant qu'une information n'est pas renseignée (ex. numéro de téléphone ou NEQ), le site **ne l'affiche pas** sur les pages publiques. Dès que vous remplissez le champ, il apparaît automatiquement partout sur le site (en-tête, pied de page, page contact, mentions légales).

### Exemple de configuration :
Ouvrez le fichier `src/data/site-config.json` avec n'importe quel éditeur de texte :

```json
{
  "business": {
    "name": "unilka",
    "legalName": "Entretien Ménager unilka Inc.",
    "neq": "1178945612",
    "slogan": "La propreté qui fait toute la différence.",
    "phone": "514 555 0123",
    "email": "contact@unilka.ca",
    "formRecipientEmail": "soumissions@unilka.ca",
    "address": "Montréal, Québec",
    "openingHours": "Lundi au vendredi : 8h00 à 18h00",
    "responseDelay": "1 jour ouvrable"
  },
  "privacy": {
    "dpoName": "Jean Dupont, Responsable de la protection des renseignements personnels",
    "dpoEmail": "confidentialite@unilka.ca"
  },
  "trust": {
    "insured": true,
    "bonded": false,
    "backgroundChecked": true,
    "ecoProducts": true,
    "trainedStaff": true
  }
}
```

- **Badges de confiance :** Passez la valeur de `false` à `true` uniquement lorsque vos assurances ou vérifications sont effectives.

---

## 2. Comment modifier ou ajouter des questions à la FAQ ?

Le contenu de votre Foire Aux Questions se trouve dans :  
📁 `src/data/faq.json`

Chaque question est structurée comme suit :
```json
{
  "id": "assurance-degats",
  "category": "services",
  "question": "Que se passe-t-il en cas de dommage lors d'un nettoyage ?",
  "answer": "Nous disposons d'une assurance responsabilité professionnelle qui couvre tout incident éventuel."
}
```
Vous pouvez ajouter autant de questions que vous le souhaitez. Elles s'afficheront automatiquement sous forme d'accordéons accessibles.

---

## 3. Comment tester le site sur votre ordinateur ?

Pour prévisualiser le site en temps réel sur votre poste :

1. Ouvrez votre terminal dans le dossier du projet :
   ```bash
   npm run dev
   ```
2. Ouvrez votre navigateur à l'adresse : [http://localhost:4321](http://localhost:4321)
3. Toutes les modifications apportées à vos fichiers s'actualisent instantanément sans recharger la page.

### Pour lancer les tests automatiques de qualité :
```bash
npm test
```
Ce test vérifie automatiquement les règles de validation (codes postaux canadiens, téléphones, consentements Loi 25 et comportement des formulaires).

---

## 4. Comment déployer votre site sur Vercel ?

Le site est optimisé pour être hébergé sur **Vercel** avec un coût d'hébergement gratuit (plan Hobby) ou minime.

### Étapes de déploiement en 3 minutes :
1. Créez un compte gratuit sur [vercel.com](https://vercel.com) si vous n'en avez pas déjà un.
2. Déposez votre code sur un dépôt GitHub (privé ou public).
3. Dans Vercel, cliquez sur **« Add New... » > « Project »** et importez votre dépôt GitHub `unilka`.
4. Vercel détecte automatiquement **Astro**. Laissez tous les réglages par défaut :
   - *Framework Preset :* Astro
   - *Build Command :* `astro build`
   - *Output Directory :* `.vercel/output`
5. Cliquez sur **Deploy**. En moins d'une minute, votre site est en ligne avec un certificat SSL HTTPS gratuit !

### Connecter votre nom de domaine personnalisé (ex. unilka.ca) :
1. Dans Vercel, allez dans **Settings > Domains**.
2. Entrez `unilka.ca` et `www.unilka.ca`.
3. Ajoutez les enregistrements DNS indiqués par Vercel chez votre registraire (ex. GoDaddy, Namecheap, Cloudflare, OVH).

---

## 5. Comment recevoir les soumissions et candidatures ?

Actuellement, les formulaires de soumission (`/soumission/`) et d'inscription candidat (`/carrieres/inscription/`) transmettent les données aux routes d'API sécurisées :
- `src/pages/api/soumission.ts`
- `src/pages/api/candidature.ts`

### Pour activer la notification par courriel ou le stockage Firebase :
1. **Notifications par courriel instantanées (Recommandé) :**  
   Utilisez un service gratuit comme **Resend** (3 000 courriels gratuits / mois).  
   Ajoutez la clé `RESEND_API_KEY` dans vos variables d'environnement Vercel (*Settings > Environment Variables*).
2. **Base de données Firestore :**  
   Ajoutez les identifiants de votre projet Firebase dans les variables d'environnement Vercel.

---

## 6. Conformité Loi 25 (Québec) et cookies

Votre site a été conçu dans le respect strict des lois québécoises et canadiennes :
- **0 Cookie traceur :** Aucun cookie publicitaire ou traceur tiers n'est installé. **Aucune bannière de consentement cookie n'est requise**, ce qui garantit une expérience utilisateur fluide et immédiate.
- **Politique de confidentialité :** Une page dédiée et conforme à la Loi 25 est accessible à l'adresse `/confidentialite/`.
- **Durée de conservation :** Configurée par défaut à 24 mois pour les soumissions et 12 mois pour les candidatures.

---

## 7. Vos tâches prioritaires à faire

Consultez le fichier `TODO-OWNER.md` pour retrouver la liste des actions à mener avant et après votre mise en ligne officielle (achat du nom de domaine, prise de photos réelles, création de la fiche Google Mon Entreprise).
