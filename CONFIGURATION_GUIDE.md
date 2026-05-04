# 📋 Guide de Configuration - Google Sheets + Email Automatique

## 🔧 Google Sheets Configuration

### 1. Créer un projet Google Cloud

1. Va sur [Google Cloud Console](https://console.cloud.google.com/)
2. Crée un nouveau projet ou sélectionne un projet existant
3. Active l'API **Google Sheets API** :
   - Recherche "Google Sheets API"
   - Clique sur "Activer"

### 2. Créer un compte de service

1. Dans la console Google Cloud, va sur **IAM et administration** → **Comptes de service**
2. Clique sur **"Créer un compte de service"**
3. Remplis les informations :
   - **Nom** : `FinanceScore Service`
   - **ID du compte de service** : `financescore-service@votre-projet.iam.gserviceaccount.com`
4. Clique sur **"Créer et continuer"**
5. Sauté l'étape "Accorder l'accès à ce compte de service" pour l'instant
6. Clique sur **"Terminer"**

### 3. Générer une clé JSON

1. Trouve ton compte de service dans la liste
2. Clique sur l'adresse email
3. Va dans l'onglet **"Clés"**
4. Clique sur **"Ajouter une clé"** → **"Créer une clé"**
5. Choisis **JSON** et clique sur **"Créer"**
6. **Télécharge immédiatement** le fichier JSON (il ne sera plus disponible après)

### 4. Créer et partager un Google Sheet

1. Crée un nouveau Google Sheet : [sheets.new](https://sheets.new)
2. Nomme-le "FinanceScore - Utilisateurs"
3. Partage le Sheet avec le compte de service :
   - Clique sur **"Partager"**
   - Ajoute l'email du compte de service : `financescore-service@votre-projet.iam.gserviceaccount.com`
   - Donne-lui les droits **"Éditeur"**

### 5. Récupérer le Sheet ID

1. Dans l'URL de ton Google Sheet, copie l'ID :
   ```
   https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
   ```
2. Le `[SHEET_ID]` est ce que tu dois mettre dans `GOOGLE_SHEET_ID`

### 6. Configurer les variables d'environnement

Crée un fichier `.env.local` à la racine du projet :

```env
# Google Sheets API
GOOGLE_SERVICE_ACCOUNT_EMAIL=financescore-service@votre-projet.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
[COPIE LE CONTENU DU FICHIER JSON ICI]
-----END PRIVATE KEY-----"
GOOGLE_SHEET_ID=votre_sheet_id_ici
```

---

## 📧 SendGrid Configuration

### 1. Créer un compte SendGrid

1. Va sur [SendGrid](https://sendgrid.com/)
2. Crée un compte gratuit (jusqu'à 100 emails/jour)
3. Vérifie ton email

### 2. Configurer l'authentification

1. Connecte-toi à SendGrid
2. Va dans **Settings** → **Sender Authentication**
3. Configure un **Domain Authentication** :
   - Ajoute ton domaine (ex: financescore.com)
   - Suis les instructions DNS (CNAME, MX, TXT)
   - Attends la validation (peut prendre jusqu'à 24h)

### 3. Créer une API Key

1. Va dans **Settings** → **API Keys**
2. Clique sur **"Create API Key"**
3. Choisis **"Restricted Access"**
4. Sélectionne les permissions :
   - **Mail Send** → **Full Access**
5. Copie la clé API (elle ne sera plus affichée)

### 4. Configurer les variables d'environnement

Ajoute ces variables à ton `.env.local` :

```env
# SendGrid
SENDGRID_API_KEY=SG.xxxxx.xxxxx.xxxxx
FROM_EMAIL=contact@financescore.com
FROM_NAME=FinanceScore
ADMIN_EMAIL=votre-email-admin@example.com
```

---

## 🧪 Tester la configuration

### 1. Tester Google Sheets

```bash
# Redémarre le serveur
npm run dev

# Fais un test complet du quiz
# Vérifie que les données apparaissent dans ton Google Sheet
```

### 2. Tester l'email

1. Fais un test complet du quiz avec ton email
2. Vérifie que tu reçois l'email de bienvenue
3. Vérifie que l'admin reçoit la notification

---

## 🔍 Dépannage

### Google Sheets ne fonctionne pas ?

1. **Vérifie les permissions** : Le compte de service doit avoir accès "Éditeur" au Sheet
2. **Vérifie la clé privée** : Assure-toi qu'il n'y a pas d'erreurs de formatage
3. **Vérifie le Sheet ID** : Copie-le directement depuis l'URL

### Les emails ne s'envoient pas ?

1. **Vérifie l'API Key** : Assure-toi qu'elle est correcte et active
2. **Vérifie le domaine** : Le domaine doit être authentifié dans SendGrid
3. **Vérifie le quota** : Le compte gratuit est limité à 100 emails/jour

### Erreurs dans les logs ?

```bash
# Vérifie les logs du serveur
npm run dev

# Les erreurs apparaissent dans la console
```

---

## 📊 Données collectées

Le système collecte automatiquement :

- **Timestamp** : Date et heure du test
- **Nom** : Nom de l'utilisateur
- **Email** : Email de l'utilisateur  
- **Score** : Score total (0-100)
- **Niveau** : Débutant/Intermédiaire/Avancé/Expert
- **Piliers** : Scores détaillés par catégorie
- **Date du test** : Format lisible

---

## 🚀 Déploiement sur Vercel

1. **Configure les variables d'environnement** dans Vercel Dashboard
2. **Déploie le projet** : `vercel deploy`
3. **Teste en production** avec l'URL de production

---

## 💡 Conseils

- **Teste en local** d'abord avant de déployer
- **Sauvegarde ta clé JSON** dans un endroit sécurisé
- **Surveille les quotas** SendGrid et Google Sheets
- **Configure les alertes** pour les nouveaux utilisateurs
