# 📧 Guide de Configuration - Brevo Email Automatique

## 🔧 Configuration Brevo

### 1. Créer un compte Brevo

1. Va sur [Brevo](https://www.brevo.com/)
2. Crée un compte gratuit (jusqu'à 300 emails/jour)
3. Vérifie ton email

### 2. Créer les templates d'emails

#### Template 1 : Email de Score
1. Connecte-toi à Brevo
2. Va dans **Campaigns** → **Templates**
3. Clique sur **"Create template"**
4. Choisis **"Email template"**
5. Utilise ce code HTML :

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #1a1a1a; color: #fff; padding: 30px; border-radius: 10px;">
    <h1 style="color: #C8F04A; text-align: center; margin-bottom: 20px;">🎉 FinanceScore</h1>
    
    <h2>Bonjour {{params.PRENOM}},</h2>
    <p>Félicitations ! Tu viens de compléter ton bilan financier FinanceScore.</p>
    
    <div style="background: #C8F04A; color: #000; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0; border-radius: 8px;">
      📊 Ton Score: {{params.SCORE}}/100<br>
      🎯 Niveau: {{params.NIVEAU}}
    </div>
    
    <h3>📈 Détail par pilier :</h3>
    <ul>
      <li>Revenus & Dépenses : {{params.P1}}/20 ({{params.P1_PCT}}%)</li>
      <li>Épargne : {{params.P2}}/20 ({{params.P2_PCT}}%)</li>
      <li>Dettes : {{params.P3}}/20 ({{params.P3_PCT}}%)</li>
      <li>Diaspora & Famille : {{params.P4}}/15 ({{params.P4_PCT}}%)</li>
      <li>Investissement : {{params.P5}}/15 ({{params.P5_PCT}}%)</li>
      <li>Vision & Objectifs : {{params.P6}}/10 ({{params.P6_PCT}}%)</li>
    </ul>
    
    <p>{{params.MESSAGE_NIVEAU}}</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{params.GUMROAD_LINK}}" style="background: #C8F04A; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
        🚀 Accéder à la version Premium
      </a>
    </div>
  </div>
</div>
```

#### Template 2 : Email Premium
1. Crée un deuxième template
2. Utilise ce code HTML :

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #1a1a1a; color: #fff; padding: 30px; border-radius: 10px;">
    <h1 style="color: #C8F04A; text-align: center; margin-bottom: 20px;">👑 FinanceScore Premium</h1>
    
    <h2>Bienvenue {{params.PRENOM}},</h2>
    <p>Félicitations pour ton passage à la version Premium !</p>
    
    <div style="background: #C8F04A; color: #000; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0; border-radius: 8px;">
      📊 Ton Score: {{params.SCORE}}/100<br>
      🎯 Niveau: {{params.NIVEAU}}
    </div>
    
    <p>{{params.MESSAGE_MOTIVANT}}</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{params.PDF_LINK}}" style="background: #C8F04A; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
        📄 Télécharger ton plan PDF
      </a>
    </div>
  </div>
</div>
```

### 3. Récupérer les IDs des templates

1. Dans Brevo, va sur **Campaigns** → **Templates**
2. Clique sur chaque template
3. L'ID est dans l'URL : `app.brevo.com/templates/email/edit/**42** ← ce nombre
4. Note les deux IDs

### 4. Configurer les variables d'environnement

Crée un fichier `.env.local` à la racine du projet :

```env
# Brevo
BREVO_API_KEY=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
BREVO_TEMPLATE_SCORE=42
BREVO_TEMPLATE_PREMIUM=43
```

### 5. Mettre à jour les IDs dans le code

Dans `lib/brevo.ts`, remplace les IDs par défaut :

```typescript
const TEMPLATE_IDS = {
  score:   42,  // Remplace par ton vrai ID
  premium: 43,  // Remplace par ton vrai ID
};
```

---

## 🧪 Tester la configuration

### 1. Tester l'email de score

1. Fais un test complet du quiz avec ton email
2. Vérifie que tu reçois l'email avec ton score
3. Vérifie que les variables sont bien remplacées

### 2. Tester l'email premium

1. Simule un paiement avec ces paramètres :
   ```
   /resultats?success=true&purchaser_email=ton@email.com&purchaser_name=Jean Dupont&score=75
   ```
2. Vérifie que tu reçois l'email premium

---

## 🔍 Dépannage

### Les emails ne s'envoient pas ?

1. **Vérifie l'API Key** : Assure-toi qu'elle est correcte et active
2. **Vérifie les IDs de templates** : Doivent être des nombres, pas des chaînes
3. **Vérifie les variables** : Les noms dans le template doivent correspondre

### Variables non remplacées ?

1. **Vérifie la syntaxe** : Doit être `{{params.NOM_VARIABLE}}`
2. **Vérifie l'envoi** : Les paramètres doivent être envoyés dans `params`

### Erreurs dans les logs ?

```bash
# Vérifie les logs du serveur
npm run dev

# Les erreurs Brevo apparaissent dans la console
```

---

## 📊 Données envoyées

### Email de score
- **PRENOM** : Prénom de l'utilisateur
- **SCORE** : Score total (0-100)
- **NIVEAU** : Niveau (Urgence/Fragile/Progression/Solide)
- **MESSAGE_NIVEAU** : Message personnalisé
- **P1-P6** : Scores par pilier
- **P1_PCT-P6_PCT** : Pourcentages par pilier
- **GUMROAD_LINK** : Lien vers la version Premium

### Email premium
- **PRENOM** : Prénom de l'utilisateur
- **SCORE** : Score total (0-100)
- **NIVEAU** : Niveau
- **MESSAGE_MOTIVANT** : Message de motivation
- **PDF_LINK** : Lien vers le PDF selon le niveau

---

## 🚀 Déploiement sur Vercel

1. **Configure les variables** dans Vercel Dashboard
2. **Déploie le projet** : `vercel deploy`
3. **Teste en production** avec l'URL de production

---

## 💡 Conseils

- **Teste en local** d'abord avant de déployer
- **Sauvegarde ton API Key** dans un endroit sécurisé
- **Surveille les quotas** Brevo (300 emails/jour gratuit)
- **Personnalise les templates** selon ton branding
