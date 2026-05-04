# 🚀 Liens de Test FinanceScore

## 🌐 Lien Principal (Local)
```
http://localhost:3000
```

## 📱 Lien Direct vers le Quiz
```
http://localhost:3000/quiz
```

## 🎯 Test Rapide (avec données de test)
```
http://localhost:3000/resultats?score=85&name=Test&email=test@example.com
```

---

## 📋 Instructions pour tes amis

### 🔧 **Important - Configuration requise**
Pour que tes amis puissent tester depuis leur ordinateur :

1. **Option 1 - Partage réseau local** :
   - Ils doivent être sur le même réseau WiFi que toi
   - Utilise ton adresse IP locale au lieu de localhost
   - Exemple : `http://192.168.1.XXX:3000`

2. **Option 2 - Tunnel ngrok (recommandé)** :
   ```bash
   # Installer ngrok si nécessaire
   npm install -g ngrok
   
   # Lancer le tunnel
   ngrok http 3000
   ```
   - Ngrok te donnera une URL publique comme : `https://abc123.ngrok.io`

---

## 🧪 **Scénarios de Test**

### ✅ **Test Complet**
1. Faire le quiz complet (19 questions)
2. Entrer email et nom
3. Vérifier la réception de l'email
4. Consulter les résultats détaillés
5. Tester l'offre Premium

### 📊 **Test Score**
- URL directe : `http://localhost:3000/resultats?score=95&name=Jean&email=jean@test.com`
- Remplace `95` par le score souhaité
- Remplace `Jean` et `jean@test.com` par les infos du testeur

### 💳 **Test Paiement**
- Clique sur l'offre Premium
- Vérifie que le lien Payhip est généré
- Le paiement est optionnel pour le test

---

## 🔍 **Points à vérifier**

### ✅ **Fonctionnalités**
- [ ] Page d'accueil responsive
- [ ] Quiz fluide (19 questions)
- [ ] Capture email fonctionnelle
- [ ] Calcul de score correct
- [ ] Email reçu avec le bon score
- [ ] Page de résultats complète
- [ ] Offre Premium accessible
- [ ] Partage WhatsApp fonctionne

### 📧 **Email attendu**
- Sujet : "Ton score FinanceScore"
- Score : Identique à l'affichage
- Piliers : Cohérents avec le score
- Niveau : Correspondant au score

---

## 🚨 **Dépannage**

### Si le site ne charge pas :
1. Vérifie que le serveur tourne : `npm run dev`
2. Confirme le port : `http://localhost:3000`

### Si l'email n'arrive pas :
1. Vérifie les spams
2. Confirme l'adresse email
3. Regarde les logs du serveur

### Si le score est incohérent :
1. Rafraîchis la page
2. Refais le quiz
3. Le score doit être identique partout

---

## 📞 **Support**
Pour toute question sur le test :
- Regarde les logs dans le terminal
- Les erreurs sont détaillées dans la console
- Le serveur affiche les appels API en temps réel

**FinanceScore est prêt pour les tests !** 🎉
