# FinanceScore

Ton bilan financier gratuit en 10 minutes. Découvre ton score de santé financière sur 100 et reçois un plan d'action personnalisé.

## 🚀 Fonctionnalités

- **Quiz interactif** : 19 questions réparties en 6 piliers financiers
- **Score personnalisé** : Calcul sur 100 avec analyse détaillée
- **Plan d'action 90 jours** : 4 niveaux de plans adaptés à ton score
- **Intégration Google Sheets** : Sauvegarde automatique des résultats
- **Design moderne** : Interface responsive avec animations fluides
- **Payship Integration** : Upsell vers version premium

## 🛠 Stack Technique

- **Framework** : Next.js 14 (App Router)
- **Styling** : Tailwind CSS
- **Language** : TypeScript
- **Animations** : Framer Motion
- **Icons** : Lucide React
- **Forms** : React Hook Form
- **API** : Google Sheets API
- **Déploiement** : Vercel

## 📋 Prérequis

- Node.js 18+ 
- npm ou yarn
- Un compte Google Cloud pour l'API Google Sheets
- Un compte Payship pour l'upsell premium

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone <repository-url>
cd financeScore
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer Google Sheets API

1. **Créer un projet Google Cloud** :
   - Va sur [Google Cloud Console](https://console.cloud.google.com/)
   - Crée un nouveau projet

2. **Activer l'API Google Sheets** :
   - Dans ton projet, active "Google Sheets API"

3. **Créer un compte de service** :
   - Va dans "IAM et administration" → "Comptes de service"
   - Crée un nouveau compte de service
   - Télécharge la clé JSON

4. **Créer et partager ton Google Sheet** :
   - Crée un nouveau Google Sheet
   - Partage-le avec l'email du compte de service (avec droits d'édition)
   - Copie l'ID du Sheet (dans l'URL)

### 4. Configurer les variables d'environnement

Crée un fichier `.env.local` à la racine du projet :

```env
# Google Sheets API
GOOGLE_SERVICE_ACCOUNT_EMAIL=votre-service-account@votre-projet.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nVotre clé privée ici\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=votre_sheet_id_ici

# Payship (lien de ton produit Premium)
NEXT_PUBLIC_PAYSHIP_URL=https://payship.co/votre-produit

# URL du site
NEXT_PUBLIC_SITE_URL=https://financeScore.vercel.app

# Google Analytics (optionnel)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 5. Lancer le projet

```bash
npm run dev
```

Le site sera disponible sur `http://localhost:3000`

## 📁 Structure du Projet

```
financeScore/
├── app/
│   ├── layout.tsx              # Layout global
│   ├── page.tsx                # Page d'accueil
│   ├── quiz/
│   │   └── page.tsx            # Quiz interactif
│   ├── resultats/
│   │   └── page.tsx            # Page de résultats
│   ├── merci/
│   │   └── page.tsx            # Page de confirmation
│   ├── a-propos/
│   │   └── page.tsx            # Page à propos
│   ├── rgpd/
│   │   └── page.tsx            # Politique de confidentialité
│   └── api/
│       ├── subscribe/
│       │   └── route.ts        # API Google Sheets
│       └── score/
│           └── route.ts        # API calcul score
├── components/
│   ├── ui/                     # Composants réutilisables
│   ├── quiz/                   # Composants du quiz
│   ├── results/                # Composants des résultats
│   ├── layout/                 # Layout (Navbar, Footer)
│   └── home/                   # Page d'accueil
├── lib/
│   ├── types.ts                # Types TypeScript
│   ├── questions.ts            # 19 questions du quiz
│   ├── scoring.ts              # Logique de calcul du score
│   └── plans.ts                # Plans d'action 90 jours
├── public/
├── .env.local                  # Variables d'environnement
├── .env.example                # Template variables
├── next.config.js              # Configuration Next.js
├── tailwind.config.ts          # Configuration Tailwind
├── vercel.json                 # Configuration Vercel
└── package.json
```

## 🎨 Personnalisation

### Modifier les couleurs

Dans `tailwind.config.ts`, modifie les couleurs dans `theme.extend.colors` :

```typescript
colors: {
  'bg-primary': '#0D0F14',      // Fond principal
  'bg-card': '#161820',          // Cartes
  'accent-primary': '#C8F04A',    // Vert citron
  'accent-secondary': '#185FA5',  // Bleu
  'text-primary': '#F0EDE6',      // Texte principal
  'text-secondary': '#7A7D8A',    // Texte secondaire
}
```

### Modifier les questions

Dans `lib/questions.ts`, ajoute ou modifie les questions. Chaque question doit avoir :
- Un ID unique
- Un pilier
- Un texte
- 4 options avec des points

### Adapter les plans d'action

Dans `lib/plans.ts`, modifie les plans pour chaque niveau de score (0-39, 40-59, 60-79, 80-100).

## 🚀 Déploiement sur Vercel

### 1. Cloner et lancer en local

```bash
# Clone le repository
git clone <repository-url>
cd financeScore

# Installe les dépendances
npm install

# Lance le serveur de développement
npm run dev
```

Le site sera disponible sur `http://localhost:3000`.

### 2. Configurer les variables d'environnement

Crée un fichier `.env.local` à la racine du projet :

```env
# Google Sheets API
GOOGLE_SERVICE_ACCOUNT_EMAIL=votre-service-account@votre-projet.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nVotre clé privée ici\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=votre_sheet_id_ici

# Payship
NEXT_PUBLIC_PAYSHIP_URL=votre_lien_payship_ici

# URL du site
NEXT_PUBLIC_SITE_URL=https://votre-domaine.vercel.app

# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 3. Déployer sur Vercel

```bash
# Installe Vercel CLI (si non installé)
npm i -g vercel

# Déploie le projet
vercel deploy
```

Ou via l'interface web :

1. Va sur [Vercel](https://vercel.com)
2. Importe ton repository GitHub/GitLab/Bitbucket
3. Configure les variables d'environnement dans les settings du projet
4. Vercel déploiera automatiquement ton projet

### 4. Configurer un domaine personnalisé

1. Dans les settings Vercel, ajoute ton domaine personnalisé
2. Configure les DNS comme indiqué par Vercel
3. Attends la propagation DNS (peut prendre jusqu'à 24h)

### 5. Vérifier le déploiement

```bash
# Test le build localement
npm run build

# Vérifie qu'il n'y a pas d'erreurs
npm start
```

## 📊 Analytics

Pour activer Google Analytics :

1. Ajoute `NEXT_PUBLIC_GA_ID` dans tes variables d'environnement
2. Le tracking est automatiquement configuré dans le layout

## 🔧 Développement

### Commandes disponibles

```bash
npm run dev      # Lancer le serveur de développement
npm run build    # Build pour production
npm run start    # Lancer le serveur de production
npm run lint      # Linter ESLint
```

### Architecture

- **App Router** : Utilisation du routing Next.js 14
- **Server Components** : API routes pour le calcul et la sauvegarde
- **Client Components** : Pages interactives avec état local
- **TypeScript** : Typage strict pour la maintenance

## 🤝 Contribuer

1. Fork le projet
2. Crée une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit tes changements (`git commit -am 'Ajouter nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvre une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.

## 🆘 Support

Pour toute question ou problème :

- Contact : contact@financescore.fr
- Documentation : Voir les fichiers du projet
- Issues : Ouvre une issue sur GitHub

---

**FinanceScore** par Transfair · Éducation Financière pour la Diaspora
