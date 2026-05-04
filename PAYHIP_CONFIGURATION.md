# 💳 Guide de Configuration - Payhip Payment System

## 🔧 Configuration Payhip

### 1. Créer un compte Payhip

1. Va sur [Payhip](https://payhip.com/)
2. Crée un compte marchand gratuit
3. Complète ton profil et configure les méthodes de paiement (PayPal, Stripe)

### 2. Configurer le produit Premium

1. Dans le dashboard Payhip, va sur **Products**
2. Clique sur **"Add New Product"**
3. Remplis les informations :
   - **Product Name** : `FinanceScore Premium`
   - **Description** : `Accès complet à FinanceScore Premium avec PDF personnalisé selon ton score financier`
   - **Price** : `4.99 EUR`
   - **Product Type** : `Digital Product`
   - **Product URL** : `https://payhip.com/b/53DCE`

### 3. Configurer les champs personnalisés

1. Dans les settings du produit, ajoute des champs personnalisés :
   - **Field 1** : `email` - Email de l'utilisateur
   - **Field 2** : `name` - Nom de l'utilisateur  
   - **Field 3** : `score` - Score financier (0-100)

### 4. Configurer le webhook

1. Va sur **Settings** → **Webhooks**
2. Clique sur **"Add Webhook"**
3. Configure :
   - **Webhook URL** : `https://ton-domaine.vercel.app/api/payhip/webhook`
   - **Events** : Sélectionne `Sale Completed`
   - **Secret** : Génère un secret sécurisé et copie-le

### 5. Récupérer la clé API

1. Va sur **Settings** → **API Keys**
2. Copie ta clé API Payhip

### 6. Configurer les variables d'environnement

Crée un fichier `.env.local` à la racine du projet :

```env
# Payhip
PAYHIP_API_KEY=922cda0e1d2e70b0241253dfac1a650020760c71
PAYHIP_WEBHOOK_SECRET=your_webhook_secret_here

# Autres services
BREVO_API_KEY=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
GOOGLE_SHEET_ID=votre_sheet_id_ici
NEXT_PUBLIC_SITE_URL=https://ton-domaine.vercel.app
```

---

## 🔄 Flux de paiement Payhip

### 1. Utilisateur clique sur "Accéder à la version Premium"

```typescript
// Dans PremiumCTA.tsx
const handlePremiumPurchase = async () => {
  const payhipUrl = 'https://payhip.com/b/53DCE';
  const paymentLink = payhipService.createPaymentLink(payhipUrl, {
    email: userEmail,
    name: userName,
    score: score,
  });
  
  // Redirection vers Payhip
  window.location.href = paymentLink;
};
```

### 2. Payhip traite le paiement

- L'utilisateur est redirigé vers la page de paiement Payhip
- Payhip traite le paiement (PayPal, Stripe, carte bancaire)
- Payhip envoie le résultat au webhook

### 3. Webhook reçoit la confirmation

```typescript
// Dans /api/payhip/webhook/route.ts
export async function POST(req: NextRequest) {
  const payload = await req.json();
  
  if (payload.event === 'sale.completed') {
    // Envoyer l'email premium
    await sendPremiumEmail({
      email: payload.buyer_email,
      prenom: payload.buyer_name,
      score: payload.custom_fields?.score || 0,
    });
  }
}
```

### 4. Email premium envoyé automatiquement

- Le webhook déclenche l'envoi de l'email Brevo
- L'utilisateur reçoit le PDF personnalisé selon son score
- Les données sont sauvegardées dans Google Sheets

---

## 🧪 Tester la configuration

### 1. Tester le webhook

```bash
# Test avec curl
curl -X POST https://ton-domaine.vercel.app/api/payhip/webhook \
  -H "Content-Type: application/json" \
  -H "x-payhip-signature: test_signature" \
  -d '{
    "event": "sale.completed",
    "sale_id": "test_123",
    "product_id": "53DCE",
    "product_name": "FinanceScore Premium",
    "product_price": 4.99,
    "currency": "EUR",
    "buyer_email": "test@example.com",
    "buyer_name": "Test User",
    "quantity": 1,
    "total": 4.99,
    "fee": 0.50,
    "net": 4.49,
    "custom_fields": {"score": 75},
    "created_at": "2024-01-01T00:00:00Z"
  }'
```

### 2. Tester le paiement complet

1. Fais un quiz complet sur ton site
2. Clique sur "Accéder à la version Premium"
3. Complète un paiement test réel
4. Vérifie que :
   - Le paiement est créé dans Payhip
   - L'email premium est reçu
   - Les données sont sauvegardées dans Google Sheets

---

## 🔍 Dépannage

### Le webhook ne fonctionne pas ?

1. **Vérifie l'URL** : Doit être accessible publiquement
2. **Vérifie le secret** : Doit correspondre à celui configuré dans Payhip
3. **Vérifie la signature** : La vérification HMAC doit être correcte

### L'email premium n'est pas envoyé ?

1. **Vérifie Brevo** : Templates et API key doivent être configurés
2. **Vérifie les logs** : Console du serveur et logs Payhip
3. **Vérifie les données** : Email et score doivent être valides

### Les champs personnalisés ne sont pas transmis ?

1. **Vérifie la configuration** : Les champs doivent être activés dans Payhip
2. **Vérifie l'URL** : Les paramètres doivent être correctement formatés
3. **Vérifie les logs** : Les données doivent apparaître dans le webhook

---

## 📊 Données collectées par Payhip

### Données de la vente
- **sale_id** : ID unique de la vente
- **buyer_email** : Email de l'acheteur
- **buyer_name** : Nom de l'acheteur
- **product_price** : Prix (4.99 EUR)
- **currency** : Devise (EUR)
- **total** : Montant total
- **fee** : Frais Payhip
- **net** : Montant net reçu
- **custom_fields** : Données personnalisées (email, name, score)

### Champs personnalisés
```typescript
custom_fields: {
  email: 'user@example.com',
  name: 'Jean Dupont',
  score: 75,
}
```

---

## 🚀 Déploiement sur Vercel

1. **Configure les variables** dans Vercel Dashboard :
   - `PAYHIP_API_KEY`
   - `PAYHIP_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_SITE_URL`

2. **Déploie le projet** :
   ```bash
   vercel deploy
   ```

3. **Configure le webhook** dans Payhip :
   - URL : `https://ton-domaine.vercel.app/api/payhip/webhook`
   - Secret : Copie depuis Vercel variables

4. **Teste en production** :
   - Fais un paiement test réel
   - Vérifie les emails et webhooks

---

## 💡 Conseils de sécurité

1. **Sécurise ton webhook** :
   - Utilise toujours HTTPS
   - Vérifie la signature HMAC
   - Ne traite que les événements attendus

2. **Gère les erreurs** :
   - Log toutes les erreurs
   - Envoie des alertes pour les paiements échoués
   - Implémente des retry pour les webhooks

3. **Surveille les transactions** :
   - Vérifie les montants attendus
   - Surveille les activités suspectes
   - Sauvegarde les logs de paiement

---

## 📈 Monitoring

### Logs à surveiller
```bash
# Logs du serveur
npm run dev

# Logs Payhip (dans le dashboard)
- Ventes complétées
- Webhooks appelés
- Revenus générés

# Logs Brevo
- Emails envoyés
- Erreurs d'envoi
- Templates utilisés
```

### Métriques importantes
- **Taux de conversion** : % d'utilisateurs qui achètent Premium
- **Revenus par utilisateur** : Moyenne des achats
- **Taux de livraison** : % d'emails premium reçus

---

## 🎯 Résultat final

Avec Payhip configuré, FinanceScore offre :

✅ **Paiement sécurisé** par PayPal, Stripe, carte bancaire
✅ **Webhook automatique** pour les paiements réussis
✅ **Email premium** envoyé immédiatement
✅ **Stockage des données** dans Google Sheets
✅ **Champs personnalisés** pour transporter le score
✅ **Monitoring complet** des transactions
✅ **Sans frais mensuels** (Payhip est gratuit pour démarrer)

FinanceScore devient ainsi un **produit SaaS complet** avec monétisation Payhip intégrée !
