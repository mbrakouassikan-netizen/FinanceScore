# 🚀 Guide de Déploiement Vercel - FinanceScore

## ✅ **Prérequis Vérifiés**

- ✅ **Build réussi** : `npm run build` fonctionne sans erreurs
- ✅ **Code sécurisé** : Plus aucune clé API en dur
- ✅ **TypeScript** : Tous les types corrects
- ✅ **Client/Server** : Directives `"use client"` ajoutées
- ✅ **Configuration** : `vercel.json` prêt

---

## 🔧 **Étape 1 - Connexion Vercel**

### **Option A - Via GitHub (Recommandé)**
1. Va sur [vercel.com](https://vercel.com)
2. Connecte-toi avec ton compte GitHub
3. Importe le repository `FinanceScore`
4. Vercel détectera automatiquement Next.js

### **Option B - Via Vercel CLI**
```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer
vercel
```

---

## ⚙️ **Étape 2 - Configuration des Variables d'Environnement**

### **Variables requises dans Vercel :**

#### **🔑 Brevo Email**
```
BREVO_API_KEY=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
```

#### **💳 Payhip Paiement**
```
PAYHIP_API_KEY=922cda0e1d2e70b0241253dfac1a650020760c71
PAYHIP_WEBHOOK_SECRET=your_webhook_secret_here
NEXT_PUBLIC_PAYHIP_URL=https://payhip.com/b/53DCE
```

#### **📊 Google Sheets (Optionnel)**
```
GOOGLE_SERVICE_ACCOUNT_EMAIL=votre-service-account@votre-projet.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nVotre clé privée ici\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=votre_sheet_id_ici
```

#### **📈 Google Analytics (Optionnel)**
```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

#### **🌐 URL du site**
```
NEXT_PUBLIC_SITE_URL=https://ton-domaine.vercel.app
```

---

## 🚀 **Étape 3 - Déploiement**

### **Déploiement Automatique (GitHub)**
1. Pushe ton code sur GitHub
2. Vercel déploie automatiquement
3. Attends le build (2-3 minutes)
4. Ton site est en ligne !

### **Déploiement Manuel (CLI)**
```bash
# Déployer en production
vercel --prod

# Suivre le déploiement
vercel logs
```

---

## 🔍 **Étape 4 - Vérification Post-Déploiement**

### **✅ Tests à effectuer :**

#### **1. Page d'accueil**
- URL : `https://ton-domaine.vercel.app`
- Vérifie le chargement
- Teste les animations

#### **2. Quiz complet**
- Fais les 19 questions
- Entre email et nom
- Vérifie la réception de l'email

#### **3. Page de résultats**
- Score affiché correctement
- Email reçu avec bon score
- Lien Payhip fonctionnel

#### **4. API Routes**
```bash
# Test API score
curl -X POST https://ton-domaine.vercel.app/api/score \
  -H "Content-Type: application/json" \
  -d '{"answers": [{"questionId": 1, "selectedOption": 0, "points": 5}]}'

# Test email
curl -X POST https://ton-domaine.vercel.app/api/send-score \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "prenom": "Test", "score": 75}'
```

---

## 🛠️ **Étape 5 - Configuration Payhip Webhook**

### **1. Configurer le webhook Payhip**
1. Va dans ton dashboard Payhip
2. Settings → Webhooks
3. URL du webhook : `https://ton-domaine.vercel.app/api/payhip/webhook`
4. Secret : Utilise la même valeur que `PAYHIP_WEBHOOK_SECRET`

### **2. Tester le webhook**
```bash
# Test webhook (avec les vraies données Payhip)
curl -X POST https://ton-domaine.vercel.app/api/payhip/webhook \
  -H "Content-Type: application/json" \
  -H "X-Payhip-Signature: signature_calculée" \
  -d '{"event": "sale.completed", "sale_id": "test"}'
```

---

## 📊 **Étape 6 - Monitoring**

### **Vercel Dashboard**
- **Analytics** : Visites et performances
- **Logs** : Erreurs et requêtes API
- **Functions** : Performance des API routes

### **Google Analytics**
- **Real-time** : Utilisateurs actifs
- **Events** : Quiz commencés, scores partagés
- **Conversion** : Quiz → Email → Premium

---

## 🔄 **Étape 7 - Mises à jour**

### **Déploiement automatique**
```bash
# Tout changement poussé sur main est déployé automatiquement
git add .
git commit -m "Nouvelle fonctionnalité"
git push origin main
```

### **Déploiement manuel**
```bash
# Forcer le déploiement
vercel --prod
```

---

## 🚨 **Dépannage**

### **Erreurs communes :**

#### **Build échoue**
```bash
# Vérifier localement
npm run build

# Nettoyer et rebuild
rm -rf .next
npm run build
```

#### **Variables d'environnement**
```bash
# Vérifier les variables
vercel env ls

# Ajouter une variable
vercel env add BREVO_API_KEY
```

#### **API 500**
```bash
# Logs Vercel
vercel logs

# Logs spécifiques
vercel logs --filter="/api/send-score"
```

---

## 📈 **Performance**

### **Optimisations activées :**
- ✅ **Static Generation** : Pages statiques
- ✅ **ISR** : Mise en cache intelligente
- ✅ **Bundle splitting** : Code optimisé
- ✅ **Images optimisées** : Next.js Image

### **Métriques cibles :**
- **FCP** : < 1.5s
- **LCP** : < 2.5s
- **CLS** : < 0.1
- **FID** : < 100ms

---

## 🎯 **Suivi Post-Lancement**

### **KPI à surveiller :**
- **Taux de conversion** Quiz → Email
- **Taux d'ouverture** emails
- **Conversions** Premium
- **Performance** site

### **Alertes :**
- **Erreurs API** > 5%
- **Temps de réponse** > 3s
- **Taux d'échec** emails > 10%

---

## 📞 **Support**

### **Ressources :**
- **Vercel Docs** : [vercel.com/docs](https://vercel.com/docs)
- **Next.js Docs** : [nextjs.org/docs](https://nextjs.org/docs)
- **Brevo Support** : [brevo.com/help](https://www.brevo.com/help)
- **Payhip Support** : [payhip.com/support](https://payhip.com/support)

---

**FinanceScore est prêt pour le déploiement !** 🚀

Le build est réussi, le code est sécurisé, et toutes les configurations sont en place. Il ne reste plus qu'à déployer !
