# 🌍 NGROK - Lien Public International

## 🚀 **Installation Ngrok**

### **Option 1 - Téléchargement direct (Recommandé)**
1. Va sur : https://ngrok.com/download
2. Télécharge ngrok pour Windows
3. Dézippe le fichier
4. Ouvre PowerShell dans le dossier ngrok

### **Option 2 - Via PowerShell (si npm fonctionne)**
```powershell
npm install -g ngrok
```

---

## 🎯 **Configuration Rapide**

### **Étape 1 : Démarrer ngrok**
```powershell
cd C:\chemin\vers\ngrok
.\ngrok.exe http 3000
```

### **Étape 2 : Copier l'URL publique**
Ngrok va t'afficher :
```
Forwarding                    https://abc123-def456.ngrok.io -> http://localhost:3000
```

**L'URL à partager est :** `https://abc123-def456.ngrok.io`

---

## 📱 **Lien WhatsApp à Partager**

### **Message Template**
```
🎯 Test FinanceScore - Disponible partout !

🔗 Lien : https://TON-URL-NGROK.io

📋 Test complet :
- 19 questions financières
- Score personnalisé
- Email avec résultats détaillés
- Offre Premium (optionnelle)

⏱️ 5 minutes maximum
🌍 Accessible dans tous les pays

Partage tes impressions ! 💬
```

---

## 🔧 **Vérification**

### **Test local**
1. Ouvre : `http://localhost:3000` ✅
2. Ouvre : `https://TON-URL-NGROK.io` ✅

### **Test international**
- Envoie le lien à un ami
- Vérifie qu'il peut accéder au site
- Confirme la réception de l'email

---

## ⚠️ **Important**

### **Durée du lien**
- Ngrok gratuit : 8 heures maximum
- Après 8h : relance ngrok pour une nouvelle URL

### **Sécurité**
- Le lien est public pendant la session ngrok
- Arrête ngrok quand tu ne testes plus

### **Performance**
- Léger délai (1-2 secondes) via ngrok
- Fonctionnalités 100% opérationnelles

---

## 🚨 **Dépannage**

### **Si ngrok ne démarre pas**
```powershell
# Authentification (une seule fois)
.\ngrok.exe authtoken TON_TOKEN

# Redémarrage
.\ngrok.exe http 3000
```

### **Si le lien ne marche pas**
1. Vérifie que `npm run dev` tourne
2. Confirme que ngrok affiche "Forwarding"
3. Teste avec un autre navigateur

---

## 📞 **Support**

### **Logs utiles**
- Ngrok montre toutes les requêtes
- Terminal npm affiche les erreurs
- Console navigateur pour le debug

**FinanceScore est maintenant accessible partout !** 🌍📱
