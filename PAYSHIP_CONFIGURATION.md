# 💳 Guide de Configuration - Payship Payment System

## 🔧 Configuration Payship

### 1. Créer un compte Payship

1. Va sur [Payship](https://payship.co/)
2. Crée un compte marchand
3. Complète ta vérification d'identité
4. Configure tes informations bancaires

### 2. Créer un produit Premium

1. Dans le dashboard Payship, va sur **Produits**
2. Clique sur **"Créer un produit"**
3. Remplis les informations :
   - **Nom** : `FinanceScore Premium`
   - **Description** : `Accès complet à FinanceScore Premium avec PDF personnalisé`
   - **Prix** : `4.99 EUR`
   - **Devise** : `EUR`
   - **Type** : `Accès unique`
   - **ID du produit** : `financescore-premium`

### 3. Configurer le webhook

1. Va sur **Webhooks** dans les settings Payship
2. Clique sur **"Ajouter un webhook"**
3. Configure :
   - **URL du webhook** : `https://ton-domaine.vercel.app/api/payship/webhook`
   - **Événements** : Sélectionne `payment.completed` et `payment.failed`
   - **Secret** : Génère un secret sécurisé et copie-le

### 4. Récupérer les clés API

1. Va sur **API Keys** dans les settings
2. Clique sur **"Créer une clé API"**
3. Choisis **"Live"** pour la production
4. Copie la clé API (commence par `psk_live_`)

### 5. Configurer les variables d'environnement

Crée un fichier `.env.local` à la racine du projet :

```env
# Payship
PAYSHIP_API_KEY=psk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PAYSHIP_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Autres services
BREVO_API_KEY=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
GOOGLE_SHEET_ID=votre_sheet_id_ici
NEXT_PUBLIC_SITE_URL=https://ton-domaine.vercel.app
```

---

## 🔄 Flux de paiement complet

### 1. Utilisateur clique sur "Accéder à la version Premium"

```typescript
// Dans PremiumCTA.tsx
const handlePremiumPurchase = async () => {
  const paymentLink = await payshipService.createPremiumPayment(
    userEmail,
    userName,
    score,
    returnUrl
  );
  
  // Redirection vers Payship
  window.location.href = paymentLink;
};
```

### 2. Payship traite le paiement

- L'utilisateur est redirigé vers la page de paiement Payship
- Payship traite le paiement (carte bancaire, PayPal, etc.)
- Payship envoie le résultat au webhook

### 3. Webhook reçoit la confirmation

```typescript
// Dans /api/payship/webhook/route.ts
export async function POST(req: NextRequest) {
  const payload = await req.json();
  
  if (payload.event === 'payment.completed') {
    // Envoyer l'email premium
    await sendPremiumEmail({
      email: payload.customer_email,
      prenom: payload.customer_name,
      score: payload.metadata.score,
    });
  }
}
```

### 4. Utilisateur est redirigé vers le site

- URL de succès : `https://ton-site.com/resultats?success=true&payment_id=xxx`
- URL d'échec : `https://ton-site.com/resultats?success=false`

---

## 🧪 Tester la configuration

### 1. Tester le webhook

```bash
# Test avec curl
curl -X POST https://ton-domaine.vercel.app/api/payship/webhook \
  -H "Content-Type: application/json" \
  -H "x-payship-signature: test_signature" \
  -d '{
    "event": "payment.completed",
    "payment_id": "test_123",
    "customer_email": "test@example.com",
    "customer_name": "Test User",
    "amount": 4.99,
    "currency": "EUR",
    "metadata": {"score": 75}
  }'
```

### 2. Tester le paiement complet

1. Fais un quiz complet sur ton site
2. Clique sur "Accéder à la version Premium"
3. Complète un paiement test (si disponible)
4. Vérifie que :
   - Le paiement est créé dans Payship
   - L'email premium est reçu
   - Les données sont sauvegardées dans Google Sheets

---

## 🔍 Dépannage

### Le paiement ne se crée pas ?

1. **Vérifie l'API Key** : Doit commencer par `psk_live_`
2. **Vérifie le produit** : Le produit `financescore-premium` doit exister
3. **Vérifie les URLs** : success_url et cancel_url doivent être valides

### Le webhook ne fonctionne pas ?

1. **Vérifie l'URL** : Doit être accessible publiquement
2. **Vérifie le secret** : Doit correspondre à celui configuré dans Payship
3. **Vérifie la signature** : La vérification HMAC doit être correcte

### L'email premium n'est pas envoyé ?

1. **Vérifie Brevo** : Templates et API key doivent être configurés
2. **Vérifie les logs** : Console du serveur et logs Payship
3. **Vérifie les données** : Email et score doivent être valides

### Erreurs CORS ?

```typescript
// Dans les routes API, ajoute les headers CORS
export async function POST(req: NextRequest) {
  return NextResponse.json(
    { success: true },
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, x-payship-signature',
      },
    }
  );
}
```

---

## 📊 Données collectées par Payship

### Données du paiement
- **payment_id** : ID unique du paiement
- **customer_email** : Email de l'acheteur
- **customer_name** : Nom de l'acheteur
- **amount** : Montant (4.99 EUR)
- **currency** : Devise (EUR)
- **status** : completed/failed/pending
- **metadata** : Données personnalisées (score, etc.)

### Données personnalisées
```typescript
metadata: {
  score: 75,
  product_name: 'FinanceScore Premium',
  customer_email: 'user@example.com',
  customer_name: 'Jean Dupont',
}
```

---

## 🚀 Déploiement sur Vercel

1. **Configure les variables** dans Vercel Dashboard :
   - `PAYSHIP_API_KEY`
   - `PAYSHIP_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_SITE_URL`

2. **Déploie le projet** :
   ```bash
   vercel deploy
   ```

3. **Configure le webhook** dans Payship :
   - URL : `https://ton-domaine.vercel.app/api/payship/webhook`
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

# Logs Payship (dans le dashboard)
- Paiements réussis
- Paiements échoués
- Webhooks appelés

# Logs Brevo
- Emails envoyés
- Erreurs d'envoi
- Templates utilisés
```

### Métriques importantes
- **Taux de conversion** : % d'utilisateurs qui achètent Premium
- **Taux d'échec** : % de paiements échoués
- **Délai de livraison** : Temps entre paiement et email

---

## 🎯 Résultat final

Avec Payship configuré, FinanceScore offre :

✅ **Paiement sécurisé** par carte bancaire, PayPal, etc.
✅ **Webhook automatique** pour les paiements réussis
✅ **Email premium** envoyé immédiatement
✅ **Stockage des données** dans Google Sheets
✅ **Redirection automatique** après paiement
✅ **Monitoring complet** des transactions

FinanceScore devient ainsi un **produit SaaS complet** avec monétisation intégrée !
